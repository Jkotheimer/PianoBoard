SELECT Genre FROM Favorite_genres
	JOIN Account ON Account.ID=Favorite_genres.AccountID
	WHERE Account.ID=2;
