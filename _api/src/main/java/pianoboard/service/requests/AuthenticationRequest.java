package pianoboard.service.requests;

public class AuthenticationRequest {

	private String email;
	private String username;
	private String password;

	public AuthenticationRequest() {}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public String getEmail()		{ return this.email;	}
	public String getUsername()		{ return this.username;	}
	public String getPassword()		{ return this.password;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setEmail(String email)			{ this.email = email;		}
	public void setUsername(String username)	{ this.username = username;	}
	public void setPassword(String password)	{ this.password = password;	}
}
