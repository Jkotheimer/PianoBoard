package pianoboard.domain.account;

import javax.naming.AuthenticationException;
import javax.security.auth.login.CredentialExpiredException;
import java.util.UUID;
import java.util.List;
import java.io.IOException;

import pianoboard.data_access.account.*;
import pianoboard.resources.Resources;

public class AccountManager {

	private AccountAccessor accountDB = new AccountAccessor();
	private TokenAccessor tokenDB = new TokenAccessor();

	public AccountManager() {}

	/**
	 * CREATE
	 * ________________________________________________________________________
	 */
	public Token create(String email, String password, String IP) throws IOException {
		String username = generateUsername(email);
		Account a = new Account(UUID.randomUUID().toString(), email, username, password, System.currentTimeMillis(), IP);
		accountDB.create(a);

		// Create a new token with the ID of the new account, then add a day to the timestamp for the expiration date
		Token t = new Token(a.getID());
		tokenDB.put(t);

		return t;
	}

	// Grab the given account by email, then attempt to login given the provided credentials
	public void authenticateLogin(String email, String password, String IP) throws AuthenticationException, IOException {
		accountDB.getAccountByEmail(email).login(email, password, IP);
	}

	// This function returns nothing because if verification fails, an exception is thrown, else nothing happens
	public void authenticateToken(String ID, String token, String IP) throws AuthenticationException, CredentialExpiredException {
		tokenDB.authenticate(ID, token);
	}

	// Generate a unique username based on the provided unique email
	// This appends the sum of the ascii values of the domain to the end of the username of the email
	private String generateUsername(String email) {

		// Extract the username from the email address
		int index = email.indexOf('@');
		String username = email.substring(0, index);

		// turn the domain part of the email address into an int by adding all of the ascii values of each char together
		int sum = 0;
		String domain = email.substring(index, email.length() - 1);
		for(int i = 0; i < domain.length(); i++) sum += (int) domain.charAt(i);

		// this value will technically be a unique username (given all emails are unique)
		return username + Integer.toString(sum);
	}

	/**
	 * READ
	 * ________________________________________________________________________
	 */
	public Account get(String ID) throws IOException {
		return accountDB.getAccountById(ID);
	}

	public List<Account> search(String query) throws IOException {
		return accountDB.search(query);
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

	/**
	 * UPDATE
	 * ________________________________________________________________________
	 */
	public Account update(String ID, String attribute, Object value) throws IOException {
		Account a = accountDB.getAccountById(ID);
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

	/**
	 * DELETE
	 * ________________________________________________________________________
	 */
	public void logout(String ID, String token, String IP) throws AuthenticationException, CredentialExpiredException, IOException {
		tokenDB.authenticate(ID, token);
		tokenDB.remove(ID);
	}
}
