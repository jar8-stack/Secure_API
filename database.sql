CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    name_user VARCHAR(255) UNIQUE NOT NULL,
    last_name_user VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
);

CREATE TABLE user_plans (
    plan_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    max_monitors INT NOT NULL,
    max_notifications INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE medications (
    medication_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE contraindications (
    contraindication_id INT PRIMARY KEY AUTO_INCREMENT,
    medication_id INT NOT NULL,
    contraindication TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id) REFERENCES medications(medication_id)
);

CREATE TABLE schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    medication_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    frequency INT NOT NULL,
    interval_type ENUM('hours', 'days') NOT NULL,
    dosage INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id) REFERENCES medications(medication_id)
);

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    medication_id INT NOT NULL,
    schedule_id INT NOT NULL,
    notification_type ENUM('email', 'sms') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (medication_id) REFERENCES medications(medication_id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)
);

CREATE TABLE monitors (
    monitor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE monitored_users (
    monitored_user_id INT PRIMARY KEY AUTO_INCREMENT,
    monitor_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (monitor_id) REFERENCES monitors(monitor_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE monitor_notifications (
    monitor_notification_id INT PRIMARY KEY AUTO_INCREMENT,
    monitor_id INT NOT NULL,
    notification_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (monitor_id) REFERENCES monitors(monitor_id),
    FOREIGN KEY (notification_id) REFERENCES notifications(notification_id)
);

CREATE TABLE monitoring_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    monitor_id INT NOT NULL,
    monitored_user_id INT NOT NULL,
    medication_id INT NOT NULL,
    schedule_id INT NOT NULL,
    dosage INT NOT NULL,
    log_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (monitor_id) REFERENCES monitors(monitor_id),
    FOREIGN KEY (monitored_user_id) REFERENCES monitored_users(monitored_user_id),
    FOREIGN KEY (medication_id) REFERENCES medications(medication_id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)
);
