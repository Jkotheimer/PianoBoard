package pianoboard.domain.account;

import javax.naming.AuthenticationException;
import javax.security.auth.login.CredentialExpiredException;
import java.util.UUID;

import pianoboard.resources.Resources;

public class Token {

	private String token;
	private String accountID;
	private long expDate;

	public Token() {
		this.token = UUID.randomUUID().toString();
		this.expDate = System.currentTimeMillis() + Resources.token_expiration_time;
	}

	public Token(String accountID) {
		this.accountID = accountID;
		this.token = UUID.randomUUID().toString();
		this.expDate = System.currentTimeMillis() + Resources.token_expiration_time;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	public String getToken()		{ return this.token;	}
	public String getAccountID()	{ return this.accountID;	}
	public long getExpDate()		{ return this.expDate;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	public void setToken(String token)			{ this.token = token;		}
	public void setAccountID(String accountID)	{ this.accountID = accountID;		}
	public void setExpDate(long expDate)		{ this.expDate = expDate;	}

	public void verify(String token, long timestamp) throws AuthenticationException, CredentialExpiredException {
		if(expDate - timestamp < 0) throw new CredentialExpiredException("Token Expired");
		if(! this.token.equals(token)) throw new AuthenticationException("Invalid Token");
	}
}
