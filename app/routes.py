import os
from flask import Blueprint, render_template, redirect, url_for, request, flash, current_app, jsonify, session
from werkzeug.utils import secure_filename
from datetime import date
from app import db
from app.models import Post, Story, User

main_bp = Blueprint('main', __name__)

def get_latest_profile_photo():
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'profile_photos')
    if os.path.exists(upload_folder):
        files = [f for f in os.listdir(upload_folder) if f.lower().endswith(('png', 'jpg', 'jpeg', 'gif', 'webp'))]
        if files:
            files.sort(key=lambda x: os.path.getmtime(os.path.join(upload_folder, x)), reverse=True)
            return files[0]
    return None

def get_current_user_name(first_name_only=True):
    full_name = 'User'
    
    if 'user_name' in session and session['user_name'] and session['user_name'] != 'User':
        full_name = session['user_name']
    elif 'name' in session and session['name'] and session['name'] != 'User':
        full_name = session['name']
    else:
        db_user = User.query.first()
        if db_user:
            if hasattr(db_user, 'username') and db_user.username:
                full_name = db_user.username
            elif hasattr(db_user, 'name') and db_user.name:
                full_name = db_user.name

    if first_name_only and full_name and full_name != 'User':
        return full_name.split()[0]
        
    return full_name

@main_bp.route('/')
def index():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    return render_template('index.html', user_profile_photo=profile_photo, is_logged_in=False, user_name=user_name)

@main_bp.route('/dashboard')
def dashboard():
    profile_photo = get_latest_profile_photo()
    user_first_name = get_current_user_name(first_name_only=True)
    
    return render_template(
        'dashboard.html', 
        user_profile_photo=profile_photo, 
        is_logged_in=True,
        user_name=user_first_name
    )

@main_bp.route('/workout')
def workout():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    return render_template('workout.html', user_profile_photo=profile_photo, is_logged_in=True, user_name=user_name)

@main_bp.route('/sleep')
def sleep():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    return render_template('sleep.html', user_profile_photo=profile_photo, is_logged_in=True, user_name=user_name)

@main_bp.route('/body')
def body():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    return render_template('body.html', user_profile_photo=profile_photo, is_logged_in=True, user_name=user_name)

@main_bp.route('/water', methods=['GET', 'POST'])
def water():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    hydration_active = True  
    
    if request.method == 'POST':
        opt_in = request.form.get('hydration_opt_in')
        reminder_times = request.form.getlist('reminder_times[]')
        daily_check_time = request.form.get('daily_check_time')
        
        flash('Hydration preferences saved successfully!', 'success')
        return redirect(url_for('main.water'))
        
    return render_template('water.html', user_profile_photo=profile_photo, hydration_active=hydration_active, is_logged_in=True, user_name=user_name)

@main_bp.route('/water/log', methods=['POST'])
def log_water():
    data = request.get_json()
    amount = data.get('amount') if data else None
    log_date = data.get('date', str(date.today())) if data else str(date.today())
    
    return jsonify({"status": "success", "amount": amount, "date": log_date})

@main_bp.route('/progress')
def progress():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    return render_template('progress.html', user_profile_photo=profile_photo, is_logged_in=True, user_name=user_name)

@main_bp.route('/playlist')
def playlist():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    return render_template('playlist.html', user_profile_photo=profile_photo, is_logged_in=True, user_name=user_name)

@main_bp.route('/bip', methods=['GET', 'POST'])
def bip():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    
    db_posts = Post.query.order_by(Post.created_at.desc()).all()
    db_stories = Story.query.order_by(Story.created_at.desc()).all()
    
    posts_data = [p.to_dict() for p in db_posts]
    stories_data = [s.to_dict() for s in db_stories]
    
    return render_template(
        'bip.html', 
        user_profile_photo=profile_photo, 
        is_logged_in=True, 
        user_name=user_name,
        posts=posts_data,
        stories=stories_data
    )

@main_bp.route('/api/bip/posts', methods=['GET', 'POST'])
def handle_bip_posts():
    user_name = get_current_user_name()
    if request.method == 'POST':
        media_file = request.files.get('media_file')
        caption = request.form.get('caption', '')
        music = request.form.get('music', '')
        is_muted = request.form.get('is_muted') == 'true'
        
        if not media_file or media_file.filename == '':
            return jsonify({'status': 'error', 'message': 'No media file provided'}), 400
            
        filename = secure_filename(media_file.filename)
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'bip_posts')
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        media_file.save(file_path)
        
        media_url = url_for('static', filename=f'uploads/bip_posts/{filename}')
        is_video = media_file.mimetype.startswith('video/')
        
        new_post = Post(
            author_name=user_name,
            media_url=media_url,
            is_video=is_video,
            caption=caption,
            music=music,
            is_muted=is_muted
        )
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'status': 'success', 'post': new_post.to_dict()})
    
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts])

@main_bp.route('/api/bip/posts/<int:post_id>', methods=['DELETE'])
def delete_bip_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'status': 'success'})

@main_bp.route('/api/bip/stories', methods=['GET', 'POST'])
def handle_bip_stories():
    user_name = get_current_user_name()
    if request.method == 'POST':
        media_file = request.files.get('media_file')
        caption = request.form.get('caption', '')
        music = request.form.get('music', '')
        is_muted = request.form.get('is_muted') == 'true'
        
        if not media_file or media_file.filename == '':
            return jsonify({'status': 'error', 'message': 'No media file provided'}), 400
            
        filename = secure_filename(media_file.filename)
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'bip_stories')
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        media_file.save(file_path)
        
        media_url = url_for('static', filename=f'uploads/bip_stories/{filename}')
        is_video = media_file.mimetype.startswith('video/')
        
        new_story = Story(
            author_name=user_name,
            media_url=media_url,
            is_video=is_video,
            caption=caption,
            music=music,
            is_muted=is_muted
        )
        db.session.add(new_story)
        db.session.commit()
        return jsonify({'status': 'success', 'story': new_story.to_dict()})
        
    stories = Story.query.order_by(Story.created_at.desc()).all()
    return jsonify([s.to_dict() for s in stories])

@main_bp.route('/api/bip/stories/<int:story_id>', methods=['DELETE'])
def delete_bip_story(story_id):
    story = Story.query.get_or_404(story_id)
    db.session.delete(story)
    db.session.commit()
    return jsonify({'status': 'success'})

@main_bp.route('/profile', methods=['GET', 'POST'])
def profile():
    user_name = get_current_user_name()
    if request.method == 'POST':
        if 'current_password' in request.form:
            flash('Password updated successfully!', 'success')
        else:
            new_name = request.form.get('name') or request.form.get('username')
            if new_name:
                session['user_name'] = new_name
                session['name'] = new_name
            
            birth_date = request.form.get('birth_date')
            weight = request.form.get('weight')
            height_str = request.form.get('height', '').replace(',', '.')
            height = float(height_str) if height_str else None
            
            photo = request.files.get('profile_photo')
            if photo and photo.filename != '':
                filename = secure_filename(photo.filename)
                
                upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'profile_photos')
                os.makedirs(upload_folder, exist_ok=True)
                
                photo_path = os.path.join(upload_folder, filename)
                photo.save(photo_path)
            
            flash('Profile information updated successfully!', 'success')
            
        return redirect(url_for('main.profile'))
        
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    return render_template('profile.html', user_profile_photo=profile_photo, is_logged_in=True, user_name=user_name)

@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    if request.method == 'POST':
        session['user_name'] = 'Marcelo Stobbe'
        session['name'] = 'Marcelo Stobbe'
        flash('Login successful!', 'success')
        return redirect(url_for('main.dashboard'))
    return render_template('login.html', user_profile_photo=profile_photo, is_logged_in=False, user_name=user_name)

@main_bp.route('/register', methods=['GET', 'POST'])
def register():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    if request.method == 'POST':
        session['user_name'] = 'Marcelo Stobbe'
        session['name'] = 'Marcelo Stobbe'
        flash('Registration successful!', 'success')
        return redirect(url_for('main.dashboard'))
    return render_template('login.html', user_profile_photo=profile_photo, is_logged_in=False, user_name=user_name)

@main_bp.route('/logout')
def logout():
    session.pop('user_name', None)
    session.pop('name', None)
    flash('You have successfully logged out of your account.', 'info')
    return redirect(url_for('main.login'))

@main_bp.route('/terms')
def terms():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    
    is_logged_in = 'user_id' in session or 'user' in session or session.get('logged_in') == True

    referrer = request.referrer or ''
    
    if not is_logged_in and referrer:
        if any(page in referrer for page in ['/dashboard', '/workout', '/sleep', '/body', '/water', '/progress', '/playlist', '/bip', '/profile']):
            is_logged_in = True

    return render_template('terms.html', 
                           user_profile_photo=profile_photo, 
                           is_logged_in=is_logged_in,
                           user_name=user_name)

@main_bp.route('/privacy')
def privacy():
    profile_photo = get_latest_profile_photo()
    user_name = get_current_user_name()
    
    is_logged_in = 'user_id' in session or 'user' in session or session.get('logged_in') == True
    
    referrer = request.referrer or ''
    
    if not is_logged_in and referrer:
        if any(page in referrer for page in ['/dashboard', '/workout', '/sleep', '/body', '/water', '/progress', '/playlist', '/bip', '/profile']):
            is_logged_in = True

    return render_template('privacy.html', 
                           user_profile_photo=profile_photo, 
                           is_logged_in=is_logged_in,
                           user_name=user_name)