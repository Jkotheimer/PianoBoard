package pianoboard.service.activities;

import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import javax.naming.AuthenticationException;
import javax.security.auth.login.CredentialExpiredException;

import pianoboard.domain.account.*;
import pianoboard.service.representations.authorized.*;
import pianoboard.service.representations.unauthorized.*;
import pianoboard.service.representations.*;
import pianoboard.resources.Resources;

public class AccountActivity {

	private AccountManager manager = new AccountManager();

	public AccountActivity() {}

	/**
	 * Return the representation of the account object from the database that corresponds with the provided ID
	 */
	public AccountRepresentation get(String ID, boolean isAuthorized) throws IOException {
		Account a = manager.get(ID);
		if(isAuthorized) return new AuthorizedAccountRepresentation(a);

		if(a.isPrivate()) return new PrivateAccountRepresentation(a);
		else return new PublicAccountRepresentation(a);
	}

	public Object getAttribute(String ID, String attribute) throws IOException {
		return manager.getAttribute(ID, attribute);
	}

	/**
	 * Retrieve a Map containing all username matches for the given query
	 */
	public List<AccountRepresentation> search(String query) throws IOException {
		List<Account> accounts = manager.search(query);
		List<AccountRepresentation> result = new ArrayList<>();

		// Iterate through all search results - if the account is private, only return private info, if it's public, return public info
		for(Account a : accounts) {
			if(a.isPrivate()) result.add(new PrivateAccountRepresentation(a));
			else result.add(new PublicAccountRepresentation(a));
		}

		return result;
	}

	public Token authenticateLogin(String email, String password, String IP) throws AuthenticationException, IOException {
		return manager.authenticateLogin(email, password, IP);
	}

	public void authenticateToken(String ID, String token, String IP) throws AuthenticationException, CredentialExpiredException {
		manager.authenticateToken(ID, token, IP);
	}

	public Token refreshToken(Token t, String IP) throws AuthenticationException, CredentialExpiredException {
		return manager.refreshToken(t, IP);
	}

	/**
	 * Attempt to create an account with the provided username, email, and password
	 */
	public Token create(String email, String password, String IP) throws IOException {
		return manager.create(email, password, IP);
	}
}
