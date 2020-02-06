package pianoboard.service.requests;

public class AccountRequest {

	private String email;
	private String password;

	public AccountRequest() {}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public String getEmail()		{ return this.email;	}
	public String getPassword()		{ return this.password;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setEmail(String email)			{ this.email = email;		}
	public void setPassword(String password)	{ this.password = password;	}
}
