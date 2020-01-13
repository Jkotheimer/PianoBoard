package pianoboard.service.Requests;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class AuthenticationRequest {

	private String username;
	private String password;

	public AuthenticationRequest() {}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	public String getUsername()		{ return this.username;	}
	public String getPassword()		{ return this.password;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	public void setUsername(String username)	{ this.username = username;	}
	public void setPassword(String password)	{ this.password = password;	}
}
