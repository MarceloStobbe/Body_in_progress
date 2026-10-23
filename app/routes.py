import os
from flask import Blueprint, render_template, redirect, url_for, request, flash, current_app, jsonify, session
from werkzeug.utils import secure_filename
from datetime import date

main_bp = Blueprint('main', __name__)

def get_latest_profile_photo():
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'profile_photos')
    if os.path.exists(upload_folder):
        files = [f for f in os.listdir(upload_folder) if f.lower().endswith(('png', 'jpg', 'jpeg', 'gif', 'webp'))]
        if files:
            files.sort(key=lambda x: os.path.getmtime(os.path.join(upload_folder, x)), reverse=True)
            return files[0]
    return None

@main_bp.route('/')
def index():
    profile_photo = get_latest_profile_photo()
    return render_template('index.html', user_profile_photo=profile_photo, is_logged_in=False)

@main_bp.route('/dashboard')
def dashboard():
    profile_photo = get_latest_profile_photo()
    
    user_name = session.get('name') or session.get('user') or session.get('user_name')
    
    return render_template(
        'dashboard.html', 
        user_profile_photo=profile_photo, 
        is_logged_in=True,
        user_name=user_name
    )

@main_bp.route('/workout')
def workout():
    profile_photo = get_latest_profile_photo()
    return render_template('workout.html', user_profile_photo=profile_photo, is_logged_in=True)

@main_bp.route('/sleep')
def sleep():
    profile_photo = get_latest_profile_photo()
    return render_template('sleep.html', user_profile_photo=profile_photo, is_logged_in=True)

@main_bp.route('/body')
def body():
    profile_photo = get_latest_profile_photo()
    return render_template('body.html', user_profile_photo=profile_photo, is_logged_in=True)

@main_bp.route('/water', methods=['GET', 'POST'])
def water():
    profile_photo = get_latest_profile_photo()
    hydration_active = True  
    
    if request.method == 'POST':
        opt_in = request.form.get('hydration_opt_in')
        reminder_times = request.form.getlist('reminder_times[]')
        daily_check_time = request.form.get('daily_check_time')
        
        flash('Preferências de hidratação guardadas com sucesso!', 'success')
        return redirect(url_for('main.water'))
        
    return render_template('water.html', user_profile_photo=profile_photo, hydration_active=hydration_active, is_logged_in=True)

@main_bp.route('/water/log', methods=['POST'])
def log_water():
    data = request.get_json()
    amount = data.get('amount') if data else None
    log_date = data.get('date', str(date.today())) if data else str(date.today())
    
    return jsonify({"status": "success", "amount": amount, "date": log_date})

@main_bp.route('/progress')
def progress():
    profile_photo = get_latest_profile_photo()
    return render_template('progress.html', user_profile_photo=profile_photo, is_logged_in=True)

@main_bp.route('/playlist')
def playlist():
    profile_photo = get_latest_profile_photo()
    return render_template('playlist.html', user_profile_photo=profile_photo, is_logged_in=True)

@main_bp.route('/bip', methods=['GET', 'POST'])
def bip():
    profile_photo = get_latest_profile_photo()
    if request.method == 'POST':
        flash('Publicação realizada com sucesso no feed BIP!', 'success')
        return redirect(url_for('main.bip'))
    return render_template('bip.html', user_profile_photo=profile_photo, is_logged_in=True)

@main_bp.route('/profile', methods=['GET', 'POST'])
def profile():
    if request.method == 'POST':
        if 'current_password' in request.form:
            flash('Password updated successfully!', 'success')
        else:
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
    return render_template('profile.html', user_profile_photo=profile_photo, is_logged_in=True)

@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    profile_photo = get_latest_profile_photo()
    if request.method == 'POST':
        flash('Login successful!', 'success')
        return redirect(url_for('main.dashboard'))
    return render_template('login.html', user_profile_photo=profile_photo, is_logged_in=False)

@main_bp.route('/register', methods=['GET', 'POST'])
def register():
    profile_photo = get_latest_profile_photo()
    if request.method == 'POST':
        flash('Registration successful!', 'success')
        return redirect(url_for('main.dashboard'))
    return render_template('login.html', user_profile_photo=profile_photo, is_logged_in=False)

@main_bp.route('/logout')
def logout():
    flash('You have successfully logged out of your account.', 'info')
    return redirect(url_for('main.login'))

@main_bp.route('/terms')
def terms():
    profile_photo = get_latest_profile_photo()
    
    is_logged_in = 'user_id' in session or 'user' in session or session.get('logged_in') == True

    referrer = request.referrer or ''
    
    if not is_logged_in and referrer:
        if any(page in referrer for page in ['/dashboard', '/workout', '/sleep', '/body', '/water', '/progress', '/playlist', '/bip', '/profile']):
            is_logged_in = True

    return render_template('terms.html', 
                           user_profile_photo=profile_photo, 
                           is_logged_in=is_logged_in)

@main_bp.route('/privacy')
def privacy():
    profile_photo = get_latest_profile_photo()
    
    is_logged_in = 'user_id' in session or 'user' in session or session.get('logged_in') == True
    
    referrer = request.referrer or ''
    public_pages = ['/login', '/register', '/terms', '/index', '/']
    
    if not is_logged_in and referrer:
        if any(page in referrer for page in ['/dashboard', '/workout', '/sleep', '/body', '/water', '/progress', '/playlist', '/bip', '/profile']):
            is_logged_in = True

    return render_template('privacy.html', 
                           user_profile_photo=profile_photo, 
                           is_logged_in=is_logged_in)
    
    