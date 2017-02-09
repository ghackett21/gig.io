DROP TABLE IF EXISTS Users;
Drop TABLE IF EXISTS Ratings;
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS Bids;
DROP TABLE IF EXISTS Transactions;

USE sfellers;

CREATE TABLE Users (
	Uid int NOT NULL AUTO_INCREMENT,
	Username varchar(255) NOT NULL,
	Password varchar(255) NOT NULL,
	Description varchar(255),
	Location varchar(255),
	PhoneNumber varchar(255),
	DateJoined datetime,
	NumberOfStrikes int NOT NULL,
	EmailAddress varchar(255),
	AverageRating decimal, 
	TotalNumberOfRatings int NOT NULL,
	primary key(Uid)
);

CREATE TABLE RATINGS (
	Rid int NOT NULL AUTO_INCREMENT,
	Uid int NOT NULL,
	AverageRAting decimal NOT NULL,
	Comment varchar(255),
	UidRater int NOT NULL,
	DateOfRating date NOT NULL,
	RatingType varchar(255),
	primary key(Rid)
);

CREATE TABLE Posting (
	Pid int NOT NULL AUTO_INCREMENT,
	Uid int NOT NULL,
	Location varchar(255),
	CreationTime datetime,
	Status int NOT NULL,
	Description varchar(255),
	primary key(Pid)
);

CREATE TABLE Notifications (
	Nid int NOT NULL AUTO_INCREMENT,
	Uid int NOT NULL,
	Message varchar(255),
	NotifcationTime datetime,
	primary key(Nid)
);

CREATE TABLE Bids (
	Bidid int NOT NULL AUTO_INCREMENT,
	Uid int NOT NULL,
	Pid int NOT NULL,
	BidTime datetime,
	Amount decimal,
	primary key(Bidid)
);

CREATE TABLE Transactions (
	Tid int NOT NULL AUTO_INCREMENT,
	UidFrom int NOT NULL,
	UidTo int NOT NULL,
	Amount decimal,
	TransactionTime datetime,
	primary key(Tid)
);
