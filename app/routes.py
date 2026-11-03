import os
from flask import Blueprint, render_template, redirect, url_for, request, flash, current_app, jsonify, session
from werkzeug.utils import secure_filename
from datetime import date
from app import db
from app.models import Post, Story, User

main_bp = Blueprint('main', __name__)

def get_current_user():
    user_id = session.get('user_id')
    if user_id:
        return User.query.get(user_id)
    return None

def get_current_user_name(first_name_only=True):
    user = get_current_user()
    if user and hasattr(user, 'username') and user.username:
        full_name = user.username
    elif user and hasattr(user, 'name') and user.name:
        full_name = user.name
    elif 'user_name' in session and session['user_name']:
        full_name = session['user_name']
    elif 'name' in session and session['name']:
        full_name = session['name']
    else:
        full_name = 'User'

    if first_name_only and full_name and full_name != 'User':
        return full_name.split()[0]
        
    return full_name

@main_bp.route('/')
def index():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None
    return render_template('index.html', user_profile_photo=profile_photo, is_logged_in=is_logged_in, user_name=user_name)

@main_bp.route('/dashboard')
def dashboard():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_first_name = get_current_user_name(first_name_only=True)
    is_logged_in = user is not None
    
    return render_template(
        'dashboard.html', 
        user_profile_photo=profile_photo, 
        is_logged_in=is_logged_in,
        user_name=user_first_name
    )

@main_bp.route('/workout')
def workout():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None
    return render_template('workout.html', user_profile_photo=profile_photo, is_logged_in=is_logged_in, user_name=user_name)

@main_bp.route('/sleep')
def sleep():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None
    return render_template('sleep.html', user_profile_photo=profile_photo, is_logged_in=is_logged_in, user_name=user_name)

@main_bp.route('/body')
def body():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None
    return render_template('body.html', user_profile_photo=profile_photo, is_logged_in=is_logged_in, user_name=user_name)

@main_bp.route('/water', methods=['GET', 'POST'])
def water():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    hydration_active = True  
    is_logged_in = user is not None
    
    if request.method == 'POST':
        opt_in = request.form.get('hydration_opt_in')
        reminder_times = request.form.getlist('reminder_times[]')
        daily_check_time = request.form.get('daily_check_time')
        
        flash('Hydration preferences saved successfully!', 'success')
        return redirect(url_for('main.water'))
        
    return render_template('water.html', user_profile_photo=profile_photo, hydration_active=hydration_active, is_logged_in=is_logged_in, user_name=user_name)

@main_bp.route('/water/log', methods=['POST'])
def log_water():
    data = request.get_json()
    amount = data.get('amount') if data else None
    log_date = data.get('date', str(date.today())) if data else str(date.today())
    
    return jsonify({"status": "success", "amount": amount, "date": log_date})

@main_bp.route('/progress')
def progress():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None
    return render_template('progress.html', user_profile_photo=profile_photo, is_logged_in=is_logged_in, user_name=user_name)

@main_bp.route('/playlist')
def playlist():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None
    return render_template('playlist.html', user_profile_photo=profile_photo, is_logged_in=is_logged_in, user_name=user_name)

@main_bp.route('/bip', methods=['GET', 'POST'])
def bip():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None
    
    db_posts = Post.query.order_by(Post.created_at.desc()).all()
    db_stories = Story.query.order_by(Story.created_at.desc()).all()
    
    posts_data = [p.to_dict() for p in db_posts]
    stories_data = [s.to_dict() for s in db_stories]
    
    return render_template(
        'bip.html', 
        user_profile_photo=profile_photo, 
        is_logged_in=is_logged_in, 
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
        music_preview_url = request.form.get('music_preview_url', '') 
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
            music_preview_url=music_preview_url, 
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
        music_preview_url = request.form.get('music_preview_url', '') 
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
            music_preview_url=music_preview_url, 
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
    user = get_current_user()
    if not user:
        return redirect(url_for('main.login'))
        
    section = request.args.get('section', '')
    show_password_only = section == 'password' or (request.referrer and 'password-section' in request.referrer)
    
    if request.method == 'POST':
        if 'current_password' in request.form:
            new_password = request.form.get('new_password')
            confirm_password = request.form.get('confirm_password')
            
            if new_password and new_password == confirm_password:
                if hasattr(user, 'set_password'):
                    user.set_password(new_password)
                elif hasattr(user, 'password_hash'):
                    user.password_hash = new_password
                elif hasattr(user, 'password'):
                    user.password = new_password
                db.session.commit()
                flash('Password updated successfully!', 'success')
            else:
                flash('Passwords do not match.', 'danger')
                return redirect(url_for('main.profile', section='password'))
        else:
            new_name = request.form.get('name') or request.form.get('username')
            if new_name:
                if hasattr(user, 'username'):
                    user.username = new_name
                elif hasattr(user, 'name'):
                    user.name = new_name
                session['user_name'] = new_name
                session['name'] = new_name
            
            birth_date_str = request.form.get('birth_date')
            if birth_date_str and hasattr(user, 'birth_date'):
                try:
                    user.birth_date = date.fromisoformat(birth_date_str)
                except ValueError:
                    user.birth_date = None
            
            height_str = request.form.get('height', '').replace(',', '.')
            if hasattr(user, 'height'):
                user.height = float(height_str) if height_str else None
            
            photo = request.files.get('profile_photo')
            if photo and photo.filename != '':
                filename = secure_filename(photo.filename)
                unique_filename = f"user_{user.id}_{filename}"
                
                upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'profile_photos')
                os.makedirs(upload_folder, exist_ok=True)
                
                photo_path = os.path.join(upload_folder, unique_filename)
                photo.save(photo_path)
                
                user.profile_photo = unique_filename
            
            db.session.commit()
            flash('Profile updated successfully!', 'success')
            
        return redirect(url_for('main.dashboard'))
        
    profile_photo = user.profile_photo if hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    return render_template(
        'profile.html', 
        user=user,
        user_profile_photo=profile_photo, 
        is_logged_in=True, 
        user_name=user_name,
        show_password_only=show_password_only,
        hasattr=hasattr
    )

@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        
        if user and (hasattr(user, 'check_password') and user.check_password(password) or getattr(user, 'password_hash', None) == password or getattr(user, 'password', None) == password):
            session['user_id'] = user.id
            session['user_name'] = user.username if hasattr(user, 'username') else getattr(user, 'name', 'User')
            session['name'] = session['user_name']
            flash('Login successful!', 'success')
            return redirect(url_for('main.dashboard'))
        else:
            flash('Invalid email or password.', 'danger')
            return redirect(url_for('main.login'))
            
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None
    return render_template('login.html', user_profile_photo=profile_photo, is_logged_in=is_logged_in, user_name=user_name)

@main_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Email already registered.', 'danger')
            return redirect(url_for('main.login'))
            
        user_kwargs = {'email': email}
        if hasattr(User, 'username'):
            user_kwargs['username'] = name
        elif hasattr(User, 'name'):
            user_kwargs['name'] = name
            
        new_user = User(**user_kwargs)
        if hasattr(new_user, 'set_password'):
            new_user.set_password(password)
        elif hasattr(new_user, 'password_hash'):
            new_user.password_hash = password
        elif hasattr(new_user, 'password'):
            new_user.password = password
            
        db.session.add(new_user)
        db.session.commit()
        
        session['user_id'] = new_user.id
        session['user_name'] = name
        session['name'] = name
        
        flash('Registration successful!', 'success')
        return redirect(url_for('main.profile'))
        
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None
    return render_template('login.html', user_profile_photo=profile_photo, is_logged_in=is_logged_in, user_name=user_name)

@main_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('user_name', None)
    session.pop('name', None)
    flash('You have successfully logged out of your account.', 'info')
    return redirect(url_for('main.login'))

@main_bp.route('/terms')
def terms():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None or 'user_id' in session or 'user' in session or session.get('logged_in') == True

    return render_template('terms.html', 
                           user_profile_photo=profile_photo, 
                           is_logged_in=is_logged_in,
                           user_name=user_name)

@main_bp.route('/privacy')
def privacy():
    user = get_current_user()
    profile_photo = user.profile_photo if user and hasattr(user, 'profile_photo') else None
    user_name = get_current_user_name()
    is_logged_in = user is not None or 'user_id' in session or 'user' in session or session.get('logged_in') == True

    return render_template('privacy.html', 
                           user_profile_photo=profile_photo, 
                           is_logged_in=is_logged_in,
                           user_name=user_name)