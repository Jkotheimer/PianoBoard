package pianoboard.domain.account;

import javax.naming.AuthenticationException;

public class Token {

	private String token;
	private String username;
	private long expDate;

	public Token() {}

	public Token(String username, String token, long expDate) {
		this.username = username;
		this.token = token;
		this.expDate = expDate;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	public String getToken()		{ return this.token;	}
	public String getUsername()		{ return this.username;	}
	public long getExpDate()		{ return this.expDate;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	public void setToken(String token)			{ this.token = token;		}
	public void setUsername(String username)	{ this.username = username;	}
	public void setExpDate(long expDate)		{ this.expDate = expDate;	}

	public boolean equals(Token t) throws AuthenticationException {
		if(t.getUsername().equals(this.username)) {
			if(t.getToken().equals(this.token) && t.getExpDate() == this.expDate) return true;
			throw new AuthenticationException("Invalid Token");
		}
		return false;
	}
}
