package pianoboard.service.Requests;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;

@XmlRootElement
public class AuthenticationRequest {

	private String email;
	private String username;
	private String password;

	public AuthenticationRequest() {}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	//@XmlElement(name="email")
	public String getEmail()		{ return this.email;	}

	//@XmlElement(name="username")
	public String getUsername()		{ return this.username;	}

	//@XmlElement(name="password")
	public String getPassword()		{ return this.password;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setEmail(String email)			{ this.email = email;		}
	public void setUsername(String username)	{ this.username = username;	}
	public void setPassword(String password)	{ this.password = password;	}
}
