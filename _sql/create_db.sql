DROP DATABASE IF EXISTS Pianoboard;
CREATE DATABASE Pianoboard;
USE Pianoboard;

/* ACCOUNT SPECIFIC ENTITIES */
CREATE TABLE user (
	id INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
	email VARCHAR(64) NOT NULL UNIQUE,
	username VARCHAR(32) NOT NULL UNIQUE,
	password CHAR(255) NOT NULL,
	salt CHAR(32) NOT NULL,
	creation_date DateTime NOT NULL,
	last_modified DateTime,
	is_private BIT DEFAULT 0,
	project_index TINYINT UNSIGNED DEFAULT 0,
	CONSTRAINT user_PK PRIMARY KEY (id)
);

CREATE TABLE known_ip (
	user_id INT UNSIGNED NOT NULL,
	ip_address INT UNSIGNED NOT NULL,
	login_count INT UNSIGNED,
	last_login DateTime,
	CONSTRAINT KIP_FK FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE failed_ip (
	user_id INT UNSIGNED NOT NULL,
	ip_address INT UNSIGNED NOT NULL,
	attempt_count INT UNSIGNED,
	last_attempt DateTime,
	CONSTRAINT FIP_FK FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE favorite_genres (
	user_id INT UNSIGNED NOT NULL,
	value VARCHAR(32) NOT NULL,
	CONSTRAINT Genre_FK FOREIGN KEY (user_id) REFERENCES user(id),
	CONSTRAINT Genre_PK PRIMARY KEY (user_id, value)
);

CREATE TABLE favorite_artists (
	user_id INT UNSIGNED NOT NULL,
	value VARCHAR(32) NOT NULL,
	CONSTRAINT Artist_FK FOREIGN KEY (user_id) REFERENCES user(id),
	CONSTRAINT Artist_PK PRIMARY KEY (user_id, value)
);

/* AUTHENTICATION ENTITIES */
CREATE TABLE access_token (
	token CHAR(64) NOT NULL,
	user_id INT UNSIGNED NOT NULL UNIQUE,
	form_token CHAR(64),
	expiration_date DateTime NOT NULL,
	CONSTRAINT Token_PK PRIMARY KEY (token),
	CONSTRAINT Token_FK FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE access_rights (
	entity_id INT UNSIGNED NOT NULL,
	user_id INT UNSIGNED NOT NULL,
	privileges CHAR(1) NOT NULL,
	CONSTRAINT Rights_PK PRIMARY KEY (entity_id),
	CONSTRAINT Rights_FK FOREIGN KEY (user_id) REFERENCES user(id)
);

/* PROJECT ENTITIES */
CREATE TABLE project (
	id INT UNSIGNED NOT NULL,
	user_id INT UNSIGNED NOT NULL,
	name VARCHAR(32) NOT NULL,
	genre VARCHAR(32),
	time_signature CHAR(5),
	tempo TINYINT UNSIGNED,
	creation_date DateTime,
	last_modified DateTime,
	is_private BIT DEFAULT 0,
	track_index TINYINT UNSIGNED DEFAULT 0,
	CONSTRAINT project_PK PRIMARY KEY (id),
	CONSTRAINT project_FK FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE track (
	id INT UNSIGNED NOT NULL,
	project_id INT UNSIGNED NOT NULL,
	name VARCHAR(32),
	instrument VARCHAR(32) NOT NULL,
	volume TINYINT NOT NULL,
	pan TINYINT NOT NULL,
	mute BIT,
	solo BIT,
	creation_date DateTime NOT NULL,
	last_modified DateTime,
	is_private BIT DEFAULT 0,
	recording_index TINYINT UNSIGNED DEFAULT 0,
	CONSTRAINT track_PK PRIMARY KEY (id),
	CONSTRAINT track_FK FOREIGN KEY (project_id) REFERENCES project(id)
);

CREATE TABLE recording (
	id INT UNSIGNED NOT NULL,
	track_id INT UNSIGNED NOT NULL,
	start_time INT UNSIGNED NOT NULL,
	end_time INT UNSIGNED NOT NULL,
	creation_date DateTime NOT NULL,
	last_modified DateTime,
	note_index SMALLINT UNSIGNED DEFAULT 0,
	CONSTRAINT recording_PK PRIMARY KEY (id),
	CONSTRAINT recording_FK FOREIGN KEY (track_id) REFERENCES track(id)
);

CREATE TABLE note (
	id INT UNSIGNED NOT NULL,
	recording_id INT UNSIGNED NOT NULL,
	note CHAR(2) NOT NULL,
	start_time INT UNSIGNED NOT NULL,
	duration SMALLINT UNSIGNED,
	CONSTRAINT note_PK PRIMARY KEY (id),
	CONSTRAINT note_FK FOREIGN KEY (recording_id) REFERENCES recording(id)
);
