from datetime import datetime
from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    birth_date = db.Column(db.Date, nullable=True)
    height = db.Column(db.Float, nullable=True)
    
    profile_photo = db.Column(db.String(255), nullable=True)
    
    theme_preference = db.Column(db.String(30), default='gold', nullable=False)

    workouts = db.relationship('WorkoutSession', backref='user', lazy=True)
    sleep_logs = db.relationship('SleepLog', backref='user', lazy=True)
    body_metrics = db.relationship('BodyMetric', backref='user', lazy=True)
    water_logs = db.relationship('WaterIntakeLog', backref='user', lazy=True)
    posts = db.relationship('Post', backref='user', lazy=True)
    stories = db.relationship('Story', backref='user', lazy=True)


class WorkoutSession(db.Model):
    __tablename__ = 'workout_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    duration_minutes = db.Column(db.Integer, nullable=False) 
    session_type = db.Column(db.String(50), nullable=False) 
    
    exercise_logs = db.relationship('ExerciseLog', backref='session', lazy=True)


class ExerciseLog(db.Model):
    __tablename__ = 'exercise_logs'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('workout_sessions.id'), nullable=False)
    
    exercise_name = db.Column(db.String(100), nullable=False)
    muscle_group = db.Column(db.String(50), nullable=False) 

    weight = db.Column(db.Float, nullable=True)  
    reps = db.Column(db.Integer, nullable=True) 
    sets = db.Column(db.Integer, nullable=True) 

    cardio_duration_minutes = db.Column(db.Integer, nullable=True)
    cardio_resistance_level = db.Column(db.Float, nullable=True)
    
    notes = db.Column(db.Text, nullable=True)


class SleepLog(db.Model):
    __tablename__ = 'sleep_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow().date, nullable=False)
    hours_slept = db.Column(db.Float, nullable=False)
    recovery_quality = db.Column(db.String(50), nullable=False) 


class BodyMetric(db.Model):
    __tablename__ = 'body_metrics'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow().date, nullable=False)
    weight_kg = db.Column(db.Float, nullable=False)
    abdominal_circumference_cm = db.Column(db.Float, nullable=True)


class WaterIntakeLog(db.Model):
    __tablename__ = 'water_intake_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow().date, nullable=False)
    
    target_ml = db.Column(db.Integer, nullable=False, default=3000)
    consumed_ml = db.Column(db.Integer, default=0, nullable=False)
    goal_achieved = db.Column(db.Boolean, default=False)
    
    reminder_times = db.Column(db.String(255), nullable=True) 
    notifications_enabled = db.Column(db.Boolean, default=True)


class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    author_name = db.Column(db.String(100), nullable=False, default='Marcelo Stobbe')
    media_url = db.Column(db.String(255), nullable=False)
    is_video = db.Column(db.Boolean, default=False)
    caption = db.Column(db.Text, nullable=True)
    music = db.Column(db.String(100), nullable=True)
    music_preview_url = db.Column(db.String(255), nullable=True)  
    is_muted = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "author_name": self.author_name,
            "media_url": self.media_url,
            "is_video": self.is_video,
            "caption": self.caption or "",
            "music": self.music or "",
            "music_preview_url": self.music_preview_url or "", 
            "is_muted": self.is_muted,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }


class Story(db.Model):
    __tablename__ = 'stories'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    author_name = db.Column(db.String(100), nullable=False, default='Marcelo Stobbe')
    media_url = db.Column(db.String(255), nullable=False)
    is_video = db.Column(db.Boolean, default=False)
    caption = db.Column(db.String(255), nullable=True)
    music = db.Column(db.String(100), nullable=True)
    music_preview_url = db.Column(db.String(255), nullable=True)  
    is_muted = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "author_name": self.author_name,
            "media_url": self.media_url,
            "is_video": self.is_video,
            "caption": self.caption or "",
            "music": self.music or "",
            "music_preview_url": self.music_preview_url or "",  
            "is_muted": self.is_muted,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }