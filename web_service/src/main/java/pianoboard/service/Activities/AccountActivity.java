package pianoboard.service.Activities;

import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import javax.naming.AuthenticationException;

import pianoboard.domain.account.*;
import pianoboard.service.Representations.*;
import pianoboard.resources.Resources;

public class AccountActivity {

	private AccountManager manager = new AccountManager();

	public AccountActivity() {}

	/**
	 * Return the representation of the account object from the database that corresponds with the provided username
	 */
	public AccountRepresentation get(String username) throws IOException, JsonProcessingException {
		return setLinks(
			new AccountRepresentation(
				manager.get(username)
			)
		);
	}

	/**
	 * Retrieve a list of all username matches given the search query substring
	 */
	public List<String> search(String query) throws IOException {
		return manager.search(query);
	}

	public Token authorize(String username, String password, String IP) throws AuthenticationException {
		return manager.authorize(username, password, IP);
	}

	public Token authorize(String token, String IP) {
		return manager.authorize(token, IP);
	}

	/**
	 * Attempt to create an account with the provided username, email, and password
	 */
	public AccountRepresentation create(String username, String password) throws IOException, JsonProcessingException {
		return setLinks(
			new AccountRepresentation(
				manager.create(username, password)
			)
		);
	}

	/**
	 * Add HATEOAS links to the representation to be used by the client for further functionality
	 */
	private AccountRepresentation setLinks(AccountRepresentation a) {
		return a;
	}
}
