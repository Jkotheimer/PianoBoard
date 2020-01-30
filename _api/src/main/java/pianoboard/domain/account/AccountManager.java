package pianoboard.domain.account;

import javax.naming.AuthenticationException;
import javax.security.auth.login.CredentialExpiredException;
import java.util.UUID;
import java.util.List;
import java.util.Calendar;
import java.io.IOException;

import pianoboard.data_access.account.*;

public class AccountManager {

	private AccountAccessor accountDB = new AccountAccessor();
	private TokenAccessor tokenDB = new TokenAccessor();

	public AccountManager() {}

	public Account get(String ID) throws IOException {
		return accountDB.getAccountById(ID);
	}

	public Object getAttribute(String ID, String attribute) throws IOException {
		Account a = accountDB.getAccountById(ID);
		switch(attribute) {
			case "username" : return a.getUsername();
			case "email" : return a.getEmail();
			case "ID" : return a.getID();
			case "creationDate" : return a.getCreationDate();
			case "favoriteGenres" : return a.getFavoriteGenres();
			case "favoriteArtists" : return a.getFavoriteArtists();
			case "lastLoginDate" : return a.getLastLoginDate();
			case "lastFailedLogin" : return a.getLastFailedLogin();
			default : throw new IOException("Method not supported");
		}
	}

	public List<Account> search(String query) throws IOException {
		return accountDB.searchByUsername(query);
	}

	public Token authorizeLogin(String email, String password, String IP) throws AuthenticationException, IOException {
		Calendar c = Calendar.getInstance();
		long timestamp = c.getTimeInMillis();
		Account a = accountDB.getAccountByEmail(email);
		if(a.login(email, password, IP, timestamp)) {
			// Add a day onto the current time for the expiration date
			Token t = new Token(a.getID(), UUID.randomUUID().toString(), timestamp + 86400000);
			tokenDB.put(t);
			return t;
		}
		else throw new AuthenticationException("Invalid Credentials");
	}

	// This function returns nothing because if verification fails, an exception is thrown, else nothing happens
	public void authorizeToken(String ID, String token, String IP) throws AuthenticationException, CredentialExpiredException {
		Calendar c = Calendar.getInstance();
		tokenDB.verify(ID, token, c.getTimeInMillis());
	}

	public Token create(String email, String username, String password, String IP) throws IOException {
		Calendar c = Calendar.getInstance();
		long timestamp = c.getTimeInMillis();

		Account a = new Account(UUID.randomUUID().toString(), email, username, password, timestamp, IP);
		accountDB.create(a);

		// Create a new token with the ID of the new account, then add a day to the timestamp for the expiration date
		Token t = new Token(a.getID(), UUID.randomUUID().toString(), timestamp + 86400000);
		tokenDB.put(t);

		return t;
	}

	public Account update(String AccountID, String attribute, Object value) throws IOException {
		Account a = accountDB.getAccountById(AccountID);
		switch(attribute) {
			case "username":
				a.setUsername((String)value);
				break;
			case "email":
				a.setEmail((String)value);
				break;
			case "password":
				a.setPassword((String)value);
				break;
			case "favoriteGenres":
				a.addFavoriteGenre((String)value);
				break;
			case "favoriteArtists":
				a.addFavoriteArtist((String)value);
				break;
		}
		accountDB.update(a);
		return a;
	}
}
