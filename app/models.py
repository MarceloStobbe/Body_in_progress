from datetime import datetime
from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    profile_photo = db.Column(db.String(255), nullable=True)
    
    theme_preference = db.Column(db.String(30), default='gold', nullable=False)

    workouts = db.relationship('WorkoutSession', backref='user', lazy=True)
    sleep_logs = db.relationship('SleepLog', backref='user', lazy=True)
    body_metrics = db.relationship('BodyMetric', backref='user', lazy=True)
    water_logs = db.relationship('WaterIntakeLog', backref='user', lazy=True)


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
    """
    Tracks daily sleep hours and recovery quality for performance correlation analysis.
    """
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