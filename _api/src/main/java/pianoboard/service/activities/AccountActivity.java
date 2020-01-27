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
import pianoboard.service.representations.*;
import pianoboard.resources.Resources;

public class AccountActivity {

	private AccountManager manager = new AccountManager();

	public AccountActivity() {}

	/**
	 * Return the representation of the account object from the database that corresponds with the provided ID
	 */
	public AccountRepresentation get(String ID) throws IOException {
		AccountRepresentation a = setLinks(
			new AccountRepresentation(
				manager.get(ID)
			)
		);
		System.out.println("account recieved: " + a.getID());
		return a;
	}

	public Object getAttribute(String ID, String attribute) throws IOException {
		return manager.getAttribute(ID, attribute);
	}

	/**
	 * Retrieve a Map containing all username matches for the given query
	 */
	public List<AccountSearchResult> search(String query) throws IOException {
		List<Account> accounts = manager.search(query);
		List<AccountSearchResult> result = new ArrayList<>();

		for(Account a : accounts) result.add(new AccountSearchResult(a.getID(), a.getEmail(), a.getUsername()));

		return result;
	}

	public Token authorize(String email, String password, String IP) throws AuthenticationException, IOException {
		return manager.authorize(email, password, IP);
	}

	public Token authorize(Token token, String IP) throws AuthenticationException, CredentialExpiredException {
		return manager.authorize(token, IP);
	}

	/**
	 * Attempt to create an account with the provided username, email, and password
	 */
	public AccountRepresentation create(String email, String username, String password, String IP) throws IOException {
		return setLinks(
			new AccountRepresentation(
				manager.create(email, username, password, IP)
			)
		);
	}

	/**
	 * Add HATEOAS links to the representation to be used by the client for all extensible functionality
	 */
	private AccountRepresentation setLinks(AccountRepresentation a) {
		a.setLinks(Arrays.asList(	new Link("login", "POST", Resources.rootURL + "/authentication/login"),
									new Link("authenticateToken", "POST", Resources.rootURL + "/authentication/token"),
									new Link("refresh", "GET", Resources.rootURL + "/users/" + a.getID()),
									new Link("updateUsername", "PATCH", "/users/" + a.getID() + "/username"),
									new Link("updateEmail", "PATCH", "/users/" + a.getID() + "/email"),
									new Link("updatePassword", "PATCH", "/users/" + a.getID() + "/password"),
									new Link("addFavoriteGenre", "PATCH", "/users/" + a.getID() + "/favoriteGenres"),
									new Link("addFavoriteArtist", "PATCH", "/users/" + a.getID() + "/favoriteArtists"),
									new Link("removeFavoriteGenre", "DELETE", "/users/" + a.getID() + "/favoriteGenres"),
									new Link("removeFavoriteArtist", "DELETE", "/users/" + a.getID() + "/favoriteArtists"),
									new Link("deleteAccount", "DELETE", "/users/" + a.getID())
		));
		return a;
	}
}
