package pianoboard.domain.account;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import javax.naming.AuthenticationException;

public class Account {

	private String email;
	private String username;
	private String password;
	private String ID;
	private List<String> favoriteGenres;
	private List<String> favoriteArtists;

	private long creationDate;
	private long lastLoginDate;
	private Map<String, Integer> knownIPs;

	// IP addresses pointing to login attempts
	private Map<String, Integer> failedLoginAttempts;
	private long lastFailedLogin;

	public Account() {}

	public Account(String ID, String username, String Password, long creationDate) {
		this.ID = ID;
		this.username = username;
		this.password = Password;
		this.creationDate = creationDate;
		this.lastLoginDate = creationDate;

		this.lastFailedLogin = 0;
		this.favoriteGenres = new ArrayList<>();
		this.favoriteArtists = new ArrayList<>();
		this.knownIPs = new HashMap<String, Integer>();
		this.failedLoginAttempts = new HashMap<String, Integer>();
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public String getID()								{ return this.ID;					}
	public String getUsername()							{ return this.username;				}
	public String getEmail()							{ return this.email;				}
	public String getPassword()							{ return this.password;				}
	public long getCreationDate()						{ return this.creationDate;			}
	public long getLastLoginDate()						{ return this.lastLoginDate;		}
	public long gelLastFailedLogin()					{ return this.lastFailedLogin;		}
	public int getFailedLoginAttempts(String IPAddress)	{ return this.failedLoginAttempts.get(IPAddress);	}
	public Map<String, Integer> getFailedLoginAttempts(){ return this.failedLoginAttempts;	}
	public List<String> getFavoriteGenres()				{ return this.favoriteGenres;		}
	public List<String> getFavoriteArtists()			{ return this.favoriteArtists;		}
	public Map<String, Integer> knownIPs()				{ return this.knownIPs;				}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setID(String ID)								{ this.ID = ID;							}
	public void setPassword(String password)					{ this.password = password;				}
	public void setEmail(String email)							{ this.email = email;					}
	public void setUsername(String username)					{ this.username = username;				}
	public void setCreationDate(long creationDate)				{ this.creationDate = creationDate;		}
	public void setLastLoginDate(long timestamp)				{ this.lastLoginDate = timestamp;		}
	public void setLastFailedLogin(long timestamp)				{ this.lastFailedLogin = timestamp;		}
	public void setFailedLoginAttempts(Map<String, Integer> f)	{ this.failedLoginAttempts = f;			}
	public void setFavoriteGenres(List<String> genres)			{ this.favoriteGenres = genres;			}
	public void setFavoriteArtists(List<String> artists)		{ this.favoriteArtists = artists;		}
	public void setKnownIPs(Map<String, Integer> knownIPs)		{ this.knownIPs = knownIPs;				}

	public void addFavoriteGenre(String genre)					{ this.favoriteGenres.add(genre);		}
	public void addFavoriteArtist(String artists)				{ this.favoriteArtists.add(artists);	}
	public void addIPAddress(String IPAddress)					{
		if(!this.knownIPs.containsKey(IPAddress)) this.knownIPs.put(IPAddress, 1);
		else this.knownIPs.put(IPAddress, this.knownIPs.get(IPAddress) + 1);
	}
	public void addFailedLoginAttempt(String IPAddress)			{
		if(this.failedLoginAttempts.containsKey(IPAddress)) this.failedLoginAttempts.put(IPAddress, (this.failedLoginAttempts.get(IPAddress) + 1));
		else this.failedLoginAttempts.put(IPAddress, 1);
	}
	public void clearFailedLoginAttempts(String IPAddress)		{
		if(this.failedLoginAttempts.containsKey(IPAddress)) this.failedLoginAttempts.remove(IPAddress);
	}

	/**
	 * GENERAL METHODS
	 */

	public boolean login(String username, String password, String IP, long timestamp) throws AuthenticationException {

		// If it's been at least 6 hours since the last failed login attempt, clear the failed login attempt log for the provided IP address
		if(timestamp - this.lastFailedLogin > 21600000) clearFailedLoginAttempts(IP);
		if(timestamp - this.lastFailedLogin < 1000) {
			this.lastFailedLogin = timestamp;
			throw new AuthenticationException("Only 1 login attempt per second");
		}
		if(this.knownIPs.contains(IP) && getFailedLoginAttempts(IP) > 20 || getFailedLoginAttempts(IP) > 10) {
			throw new AuthenticationException("Too many failed login attempts");
		}
		else if(this.password.equals(password) && this.username.equals(username)) {
			addIPAddress(IP);
			clearFailedLoginAttempts(IP);
			setLastLoginDate(timestamp);
			return true;
		}
		else {
			addFailedLoginAttempt(IP);
			return false;
		}
	}
}
