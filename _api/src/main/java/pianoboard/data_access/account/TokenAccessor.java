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
	public Token get(String ID) {
		for(Token t : database)
			if(t.getAccountID().equals(ID))
				return t;
	}


	/**
	 * DELETE
	 * ________________________________________________________________________
	 */
	public void remove(String ID) throws IOException {
		boolean exists = false;
		for(Token t : database) {
			if(t.getAccountID().equals(ID)) {
				database.remove(t);
				exists = true;
			}
		}
		if(!exists) throw new IOException("No token exists for the given ID");
	}
}
