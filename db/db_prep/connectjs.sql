CREATE EXTENSION chkpass;
select * from session;
CREATE TABLE roles (
	roleID serial PRIMARY KEY,
	roleName VARCHAR(40) NOT NULL,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
select * from roles;
INSERT INTO ROLES (roleID, roleName) VALUES (2, 'speaker');

CREATE TABLE users (
	userID serial PRIMARY KEY,
	roleID serial REFERENCES roles (roleID) DEFAULT 1,
	firstName VARCHAR(40) NOT NULL,
	lastName VARCHAR(40) NOT NULL,
	email VARCHAR(40) NOT NULL,
	displayName VARCHAR(40),
	password CHKPASS NOT NULL,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



select * from session;
CREATE TABLE user_shares(
	userFromID int references users (userID) NOT NULL,
	userToID int references users (userID) NOT NULL,
	constraint user_share_id UNIQUE (userFromID, userToID)
);
CREATE TABLE session (
	sessionID serial PRIMARY KEY,
	sessionName VARCHAR(40) NOT NULL,
	roomName varchar(100),
	sessionDescription VARCHAR(40) NOT NULL,
	calendar TIMESTAMP NOT NULL,
	duration varchar(10),
	trackID int references track (trackID)
);

CREATE TABLE track (
	trackID SERIAL PRIMARY KEY,
	trackName VARCHAR(40) NOT NULL
);

CREATE TABLE notifications (
  notificationID serial PRIMARY KEY,
  notificationMessage VARCHAR(1000) NOT NULL,
  notificationTime TIMESTAMP WITH TIME ZONE
);

CREATE TABLE speaker (
	speakerID serial PRIMARY KEY,
	firstName VARCHAR(40) NOT NULL,
	lastName VARCHAR(40) NOT NULL,
	company VARCHAR(100),
	description VARCHAR(1000),
	userID int
);

CREATE TABLE sessionSpeaker (
	sessionID int REFERENCES session (sessionID),
	speakerID int REFERENCES speaker (speakerID)
);

CREATE TABLE sponsors (
  sponsorID SERIAL PRIMARY KEY,
  sponsorName VARCHAR(200),
  sponsorDescription VARCHAR(20000),
  hasBooth BOOLEAN DEFAULT FALSE,
  boothLocation VARCHAR(100)
);

CREATE TABLE user_schedule (
	userID int references users (userID),
	sessionID int references session (sessionID)
);

CREATE OR REPLACE FUNCTION fetch_all_alerts()
	RETURNS TABLE (
		notificationID int,
		notificationMessage varchar,
		notificationTime TIMESTAMP WITH TIME ZONE,
		notificationname varchar
		) AS
	$func$
	 BEGIN
		RETURN QUERY
		SELECT * FROM notifications;
	 END
	 $func$ LANGUAGE plpgsql;
     
CREATE OR REPLACE FUNCTION user_share_details(sender int, receiver int)
 RETURNS BOOLEAN AS $$
 DECLARE PASSED BOOLEAN;
 BEGIN
   SELECT 1 FROM user_shares WHERE userFromID = $1 AND userToID = $2 into PASSED;
   IF PASSED THEN
	RETURN PASSED;
 -- do something
   ELSE
	INSERT INTO user_shares (userFromID, userToID) VALUES ($1, $2);
	PASSED = false;
	RETURN PASSED;
   END IF;
 END;
 $$ LANGUAGE plpgsql;

 CREATE OR REPLACE FUNCTION fetch_user_shares(int)
  RETURNS TABLE (
    userID int,
    firstName varchar,
    lastName varchar,
    email varchar
  ) AS
  $func$
  DECLARE REQUESTED BOOLEAN;
  DECLARE ACCEPTED BOOLEAN;
  BEGIN
    SELECT 1 FROM users, user_shares WHERE user_shares.userFromID = $1 AND users.userID = user_shares.userToID INTO REQUESTED;
      SELECT 1 FROM users, user_shares WHERE user_shares.userFromID = users.userID AND user_shares.userToID = $1 INTO ACCEPTED;
      IF (REQUESTED AND ACCEPTED) THEN
          RETURN QUERY
          SELECT users.userID, users.firstName, users.lastName, users.email FROM users, user_shares WHERE user_shares.userFromID = $1 AND users.userID = user_shares.userToID;
      END IF;
  END
  $func$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetch_user_requests(int)
 RETURNS TABLE (
   userID int,
   firstName varchar,
   lastName varchar,
   email varchar
 ) AS
 $func$
 BEGIN
   RETURN QUERY
   SELECT users.userID, users.firstName, users.lastName, users.email FROM users, user_shares WHERE user_shares.userToID = $1 AND users.userID = user_shares.userFromID;
 END
 $func$ LANGUAGE plpgsql;

 CREATE OR REPLACE FUNCTION select_users_shared(int)
   RETURNS TABLE (
     firstname varchar,
     lastname varchar,
     userid int
   ) AS
   $func$
   BEGIN
     RETURN QUERY
     SELECT friend.firstName, friend.lastName, friend.userID FROM users
     AS self INNER JOIN User_Shares AS shared ON self.userID = shared.userToID
     INNER JOIN Users AS friend ON shared.userFromID = friend.UserID
     WHERE self.UserID = $1;
   END
   $func$ LANGUAGE plpgsql;

 CREATE OR REPLACE FUNCTION fetch_user_list()
   RETURNS TABLE (
     firstName varchar,
     lastName varchar,
     userID int
   ) AS
   $func$
   BEGIN
     RETURN QUERY
     SELECT users.firstname, users.lastname, users.userid FROM users;
   END;
 $func$ LANGUAGE plpgsql;


 CREATE OR REPLACE FUNCTION remove_user_share(int, int)
   RETURNS BOOLEAN AS
   $func$
   DECLARE REMOVED BOOLEAN;
   BEGIN
     SELECT 1 FROM user_shares WHERE user_shares.userFromID = $1 AND user_shares.userToID = $2 INTO REMOVED;
     IF (REMOVED) THEN
       DELETE FROM user_shares WHERE user_shares.userToID = $2 AND user_shares.userFromID = $1;
       RETURN REMOVED;
     ELSE
       REMOVED = false;
       RETURN REMOVED;
     END IF;
   END;
 $func$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetch_unique_session(sessionID int)
	RETURNS TABLE (
		sessionName varchar,
		roomname varchar,
		sessiondescription varchar,
		calendar timestamp,
		duration varchar
		) AS
	$func$
	BEGIN
		RETURN QUERY
		SELECT session.sessionname, session.roomname, session.sessiondescription, session.calendar, session.duration FROM session
		WHERE session.sessionid = $1;
	 END
	 $func$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetch_unique_speaker(speakerID int)
returns TABLE (
	firstName varchar,
	lastName varchar,
	company varchar,
	description varchar
) AS
$func$
BEGIN
	RETURN QUERY
	SELECT speaker.firstname, speaker.lastname, speaker.company, speaker.description
	FROM speaker
              WHERE speaker.speakerID = $1;
END
$func$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetch_unique_speaker_sessions(speakerID int)
	RETURNS TABLE(
		sessionID int,
		sessionName varchar
	) AS
	$func$
	BEGIN
		RETURN QUERY
		SELECT sessionSpeaker.sessionID, session.sessionName
		FROM sessionSpeaker, session
		WHERE sessionSpeaker.speakerID = $1 AND sessionSpeaker.sessionID = session.sessionID;
	END
	$func$ LANGUAGE plpgsql;
    
CREATE OR REPLACE FUNCTION fetch_all_speakers()
returns TABLE (
	speakerID int,
	firstName varchar,
	lastName varchar,
	company varchar,
	description varchar,
	profileimage varchar
) AS
$func$
BEGIN
	RETURN QUERY
	SELECT speaker.speakerID, speaker.firstName, speaker.lastName, speaker.company, speaker.description, speaker.profileimage FROM speaker;
END
$func$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetch_sponsor_list()
  RETURNS TABLE (
    sponsorID int,
    sponsorName varchar,
    sponsorDescription varchar,
    hasBooth boolean,
    boothLocation varchar
  ) AS
  $func$
  BEGIN
    RETURN QUERY
    SELECT sponsors.sponsorID, sponsors.sponsorName, sponsors.sponsorDescription, sponsors.hasBooth, sponsors.boothLocation FROM sponsors;
  END;
  $func$ LANGUAGE plpgsql;

	CREATE OR REPLACE FUNCTION add_to_user_sched(userID int, sessionID int)
		RETURNS VOID AS $$
		BEGIN
		  INSERT INTO user_schedule (userID, sessionID) VALUES ($1, $2);
		END;
	$$ LANGUAGE plpgsql;

	CREATE OR REPLACE FUNCTION remove_from_user_sched(userID int, sessionID int)
	  RETURNS BOOLEAN AS $$
	  DECLARE PASSED BOOLEAN;
	  BEGIN
		SELECT 1 FROM user_schedule WHERE user_schedule.userID = $1 and user_schedule.sessionID = $2 INTO PASSED;
		IF (passed) THEN
		  DELETE FROM user_schedule WHERE user_schedule.userID = $1 AND user_schedule.sessionID = $2;
		  RETURN passed;
		ELSE
		  PASSED = false;
		  RETURN PASSED;
		END IF;
	  END;
	$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetch_user_schedule(int)
	RETURNS TABLE (
		sessionID int
		) AS
	$func$
	BEGIN
		RETURN QUERY
		SELECT session.sessionID FROM session, user_schedule WHERE user_schedule.userID = $1 AND session.sessionID = user_schedule.sessionID;
	END
	$func$ LANGUAGE plpgsql;

-- USERS

CREATE OR REPLACE FUNCTION create_user(firstname varchar(40), lastName VARCHAR(40), email varchar(40), displayname varchar(40), password chkpass) RETURNS void AS $$
  BEGIN
    INSERT INTO USERS (firstname, lastName, roleID, email, displayname, password) VALUES ($1, $2, 1, $3, $4, $5);
  END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION user_login(uname TEXT, pass TEXT)
RETURNS BOOLEAN AS $$
DECLARE passed BOOLEAN;
BEGIN
        SELECT  (password = $2) INTO passed
        FROM    users
        WHERE   email = $1;

        RETURN passed;
END;
$$  LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_email(newemail varchar(40), userInt int)
  RETURNS integer as
$BODY$
  UPDATE users set email = $1 WHERE userid = $2
  RETURNING userid;
$BODY$
  LANGUAGE sql;

CREATE OR REPLACE FUNCTION update_user_password(newPassword CHKPASS, userInt INT)
RETURNS integer as
$BODY$
  UPDATE users set password = $1 WHERE userid = $2
  RETURNING userid
$BODY$
LANGUAGE sql;

CREATE OR REPLACE FUNCTION update_user_displayname(newDisplay varchar(40), userInt int)
  RETURNS integer as
  $BODY$
    UPDATE users set displayname = newDisplay WHERE userid = userINT
    RETURNING userid
  $BODY$
  LANGUAGE sql;

	CREATE OR REPLACE FUNCTION select_user(userInt int)
	  RETURNS TABLE ( userid int, roldid int, firstname varchar(40), lastname varchar(40), email varchar(40), displayname varchar(40), password chkpass, createdAt timestamp) as
	$BODY$
	  SELECT * FROM users WHERE userid = userInt;
	$BODY$
	LANGUAGE sql;



	CREATE FUNCTION return_userID(uname text)
	RETURNS INT AS $$
	DECLARE userInt INT;
	BEGIN
		SELECT userID INTO userInt FROM users WHERE users.email = $1;
		RETURN userInt;
	END;
	$$ LANGUAGE plpgsql;
    
	CREATE OR REPLACE FUNCTION fetchAllSessions()
	 RETURNS TABLE (
		 sessionID int,
		 sessionName varchar,
		 roomname varchar,
		 sessiondescription varchar,
		 sessiontrack varchar,
		 calendar timestamp,
		 duration varchar,
		 trackID int,
		 day int,
		 speakerfirstname varchar,
		 speakerlastname varchar
		 ) AS
	 $func$
	 BEGIN
		 RETURN QUERY
		 SELECT session.sessionID, session.sessionName, session.roomName, session.sessiondescription, session.sessiontrack, session.calendar, session.duration, session.trackID, session.day, speaker.firstname, speaker.lastname FROM session, speaker, sessionspeaker
		 where (session.sessionid = sessionspeaker.sessionid) and (sessionspeaker.speakerid = speaker.speakerid);
	 END
	 $func$ LANGUAGE plpgsql;
	 select * from fetchAllSessions();
	 select  fetchAllSessions();
     
     -- Utils
 SELECT notification.notificationid, notification.schedule, notification.messagetext, notification.tag FROM notification INNER JOIN notificationqueue ON notification.notificationid=notificationqueue.notificationid WHERE notification.schedule >= CURRENT_TIMESTAMP;
-- SELECT notification.notificationid, notification.schedule
-- FROM notification
-- INNER JOIN notificationqueue
-- ON notification.notificationid=notificationqueue.notificationid
-- WHERE notification.schedule >= CURRENT_TIMESTAMP;

-- select * from notificationqueue;
-- insert into notificationqueue (notificationid) values (3);
-- select * from notification;
-- select * from notification where notificationid = 1;
-- update notification set schedule = '2018-01-06 10:36:26.542938+00' where notificationid = 3;