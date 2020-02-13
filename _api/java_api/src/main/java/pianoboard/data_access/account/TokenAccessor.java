package pianoboard.data_access.account;

import java.util.List;
import java.util.ArrayList;
import java.io.IOException;
import javax.security.auth.login.CredentialExpiredException;
import javax.naming.AuthenticationException;

import pianoboard.domain.account.Token;

public class TokenAccessor {

	private static List<Token> database = new ArrayList<>();

	public TokenAccessor() {}

	/**
	 * CREATE / UPDATE
	 * ________________________________________________________________________
	 */
	public void put(Token t) {
		Token removed_token = null;
		for(Token tok : database) {
			if(tok.getAccountID().equals(t.getAccountID())) {
				// Removing the token from within the loop causes a ConcurrentModificationException
				if(removed_token == null) removed_token = tok;
			}
		}
		if(removed_token != null) database.remove(removed_token);
		database.add(t);
	}

	/**
	 * READ
	 * ________________________________________________________________________
	 */
	public Token get(String ID) throws IOException {
		for(Token t : database)
			if(t.getAccountID().equals(ID))
				return t;
		throw new IOException("Token with user ID " + ID + " does not exist");
	}


	/**
	 * DELETE
	 * ________________________________________________________________________
	 */
	public void remove(String ID) throws IOException {
		Token to_remove = null;
		for(Token t : database) {
			if(t.getAccountID().equals(ID)) {
				to_remove = t;
			}
		}
		if(to_remove == null) throw new IOException("No token exists for the given ID");
		else database.remove(to_remove);
	}
}
