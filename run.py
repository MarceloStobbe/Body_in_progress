from app import create_app, db

app = create_app()

app.secret_key = 'body-in-progress-elite-secure-key'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, port=5000)