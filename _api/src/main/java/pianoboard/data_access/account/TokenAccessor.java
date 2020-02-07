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

	public void put(Token t) {
		Token removed_token = null;
		for(Token tok : database) {
			if(tok.getAccountID().equals(t.getAccountID())) {
				// Removing the token from within the loop causes a ConcurrentModificationException
				removed_token = tok;
				break;
			}
		}
		if(removed_token != null) database.remove(removed_token);
		database.add(t);
	}

	public void authenticate(String ID, String token) throws AuthenticationException, CredentialExpiredException {
		for(Token t : database) {
			if(t.getAccountID().equals(ID)) {
				t.verify(token);
				return;
			}
		}
		throw new AuthenticationException("Token Not Found");
	}

	public void remove(String ID) throws IOException {
		for(Token t : database) {
			if(t.getAccountID().equals(ID)) {
				database.remove(t);
				return;
			}
		}
		throw new IOException("No token exists for the given ID");
	}
}
