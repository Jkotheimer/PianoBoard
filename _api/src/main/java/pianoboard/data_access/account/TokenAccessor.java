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
			if(tok.getUsername().equals(t.getUsername()))
				database.remove(tok);
		database.add(t);
	}

	public void verify(Token t, long timestamp) throws AuthenticationException, CredentialExpiredException {
		for(Token tok : database) {
			if(tok.equals(t)) {
				if((timestamp - tok.getExpDate()) < 7200000) return;
				throw new CredentialExpiredException("Token Expired");
			}
		}
	}
}
