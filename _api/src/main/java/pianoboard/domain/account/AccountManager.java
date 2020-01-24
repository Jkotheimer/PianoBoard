package pianoboard.domain.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import javax.naming.AuthenticationException;
import java.util.UUID;
import java.util.List;
import java.util.Calendar;
import java.io.IOException;

import pianoboard.data_access.account.*;

public class AccountManager {

	private AccountAccessor accountDB = new AccountAccessor();
	private TokenAccessor tokenDB = new TokenAccessor();
	private ObjectMapper mapper = new ObjectMapper();

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

	public Token authorize(String email, String password, String IP) throws AuthenticationException, IOException {
		Calendar c = Calendar.getInstance();
		long timestamp = c.getTimeInMillis();
		Account a = accountDB.getAccountByEmail(email);
		if(a.login(email, password, IP, timestamp)) {
			// Add 2 days onto the current time for the expiration date
			Token t = new Token(email, UUID.randomUUID().toString(), Long.toString(timestamp + 172800000));
			//tokenDB.put(t);
			return t;
		}
		else throw new AuthenticationException("Invalid Credentials");
	}

	public Token authorize(String token, String IP) throws AuthenticationException {
		// TODO validate token and add IP to account
		return new Token();
	}

	public Account create(String email, String username, String password, String IP) throws IOException, JsonProcessingException {
		Calendar c = Calendar.getInstance();
		long timestamp = c.getTimeInMillis();

		Account a = new Account(UUID.randomUUID().toString(), email, username, password, timestamp, IP);
		accountDB.create(a);
		return a;
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
			case "addgenres":
				a.addFavoriteGenre((String)value);
				break;
			case "removegenres":
				a.removeFavoriteGenre((String)value);
				break;
			case "addartists":
				a.addFavoriteArtist((String)value);
				break;
			case "removeartists":
				a.removeFavoriteArtist((String)value);
				break;
		}
		accountDB.update(a);
		return a;
	}
}
