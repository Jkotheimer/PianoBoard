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
		for(Token tok : database)
			if(tok.getAccountID().equals(t.getAccountID()))
				database.remove(tok);
		database.add(t);
	}

	public void verify(String ID, String token, long timestamp) throws AuthenticationException, CredentialExpiredException {
		for(Token t : database) {
			if(t.getAccountID().equals(ID)) {
				t.verify(token, timestamp);
				return;
			}
		}
		throw new AuthenticationException("Token Not Found");
	}
}
