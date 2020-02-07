package pianoboard.data_access.account;

import java.util.List;
import java.util.ArrayList;
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

	public void authenticate(String ID, String token, long timestamp) throws AuthenticationException, CredentialExpiredException {
		for(Token t : database) {
			if(t.getAccountID().equals(ID)) {
				t.verify(token, timestamp);
				return;
			}
		}
		throw new AuthenticationException("Token Not Found");
	}

	public void refresh(Token token) throws AuthenticationException, CredentialExpiredException {
		Token removed_token = null;
		for(Token t : database) {
			if(t.getAccountID().equals(t.getAccountID())) {
				t.verify(token.getToken(), token.getExpDate());
				// Removing the token from within the loop causes a ConcurrentModificationException
				removed_token = t;
				break;
			}
		}
		database.remove(removed_token);
	}
}
