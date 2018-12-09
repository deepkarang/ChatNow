CREATE TABLE messagelog (
    id INT NOT NULL AUTO_INCREMENT,
    sender varchar(11), 
    message text,  	
    receiver char(100),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id));

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username varchar(11),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id));