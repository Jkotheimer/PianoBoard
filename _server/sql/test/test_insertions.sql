USE Pianoboard;
INSERT INTO Account
	(Email, Username, Password, Creation_date, Is_private)
	VALUES
	('jkotheimer@luc.edu', 'jkotheimer625', 'b73872e0e3a0b22dc599a7c4bbf1c8193a2a1b4c3efaba9ea79e9b7f4777f4a0', 1584810571743, 1),
	('jkotheimer9@gmail.com', 'jkotheimer512', '034981b88b1f408287b55cb4d223dc9d441c872179ab7e8b91c6c71141d07171', 1584811891612, 0),
	('jkotheimer@outlook.com', 'jkotheimer855', '94bea15e659d67c232cea08120683d968031bd6fe825b02396e9fcb262d588fa', 1584811904404, 1);

INSERT INTO Favorite_genres
	(AccountID, Genre)
	VALUES
	(1, "Pop"),
	(2, "Rock"),
	(3, "Metal"),
	(2, "Punk"),
	(2, "Rap"),
	(1, "R&B"),
	(3, "Soul"),
	(1, "Soul"),
	(2, "R&B"),
	(3, "Country");

INSERT INTO Favorite_artists
	(AccountID, Artist)
	VALUES
	(3, "Blink 182"),
	(2, "Blink 182"),
	(1, "Ariana Grande"),
	(1, "Adele"),
	(3, "Avenged Sevenfold"),
	(2, "Daughtry"),
	(3, "Orange Rex County"),
	(2, "The Band Camino"),
	(1, "The Maine");
