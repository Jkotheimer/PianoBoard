package pianoboard.domain.account;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import javax.naming.AuthenticationException;

public class Account {

	private String ID;
	private String email;
	private String username;
	private String password;
	private long creationDate;

	private List<String> favoriteGenres;
	private List<String> favoriteArtists;
	private List<LoginRecord> knownIPs;
	private List<LoginRecord> failedLoginAttempts;

	public Account() {}

	public Account(String ID, String email, String username, String Password, long creationDate, String IP) {
		this.ID = ID;
		this.email = email;
		this.username = username;
		this.password = Password;
		this.creationDate = creationDate;

		this.favoriteGenres = new ArrayList<String>();
		this.favoriteArtists = new ArrayList<String>();
		this.knownIPs = new ArrayList<LoginRecord>();
		this.failedLoginAttempts = new ArrayList<LoginRecord>();

		addSuccessfulLoginAttempt(IP, creationDate);
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
	public List<String> getFavoriteGenres()				{ return this.favoriteGenres;		}
	public List<String> getFavoriteArtists()			{ return this.favoriteArtists;		}
	public List<LoginRecord> getFailedLoginAttempts()	{ return this.failedLoginAttempts;	}
	public List<LoginRecord> knownIPs()					{ return this.knownIPs;				}

	public int getFailedLoginAttempts(String IPAddress)	{
		for(LoginRecord r : this.failedLoginAttempts)
			if(r.getIP().equals(IPAddress))
				return r.getLoginCount();
		return 0;
	}

	public long getLastLoginDate()						{
		long lastLoginDate = 0;

		for(LoginRecord r : this.knownIPs)
			if(r.getLastLoginDate() > lastLoginDate)
				lastLoginDate = r.getLastLoginDate();

		return lastLoginDate;
	}
	public long getLastFailedLogin()					{
		long lastFailedLogin = 0;

		for(LoginRecord r : this.failedLoginAttempts)
			if(r.getLastLoginDate() > lastFailedLogin)
				lastFailedLogin = r.getLastLoginDate();

		return lastFailedLogin;
	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setID(String ID)								{ this.ID = ID;							}
	public void setPassword(String password)					{ this.password = password;				}
	public void setEmail(String email)							{ this.email = email;					}
	public void setUsername(String username)					{ this.username = username;				}
	public void setCreationDate(long creationDate)				{ this.creationDate = creationDate;		}
	public void setFavoriteGenres(List<String> genres)			{ this.favoriteGenres = genres;			}
	public void setFavoriteArtists(List<String> artists)		{ this.favoriteArtists = artists;		}
	public void setKnownIPs(List<LoginRecord> knownIPs)			{ this.knownIPs = knownIPs;				}
	public void setFailedLoginAttempts(List<LoginRecord> f)		{ this.failedLoginAttempts = f;			}

	public void addFavoriteGenre(String genre)					{ this.favoriteGenres.add(genre);		}
	public void addFavoriteArtist(String artists)				{ this.favoriteArtists.add(artists);	}
	public void removeFavoriteGenre(String genre)				{ this.favoriteGenres.remove(genre);	}
	public void removeFavoriteArtist(String artist)				{ this.favoriteArtists.remove(artist);	}

	/**
	 * GENERAL METHODS
	 */



	private void addSuccessfulLoginAttempt(String IPAddress, long timestamp) {
		for(LoginRecord r : this.knownIPs) {
			if(r.getIP().equals(IPAddress)) {
				r.addLogin();
				r.setLastLoginDate(timestamp);
				return;
			}
		}
		this.knownIPs.add(new LoginRecord(IPAddress, timestamp));
	}

	private void addFailedLoginAttempt(String IPAddress, long timestamp) {
		for(LoginRecord r : this.failedLoginAttempts) {
			if(r.getIP().equals(IPAddress)) {
				r.addLogin();
				r.setLastLoginDate(timestamp);
				return;
			}
		}
		this.knownIPs.add(new LoginRecord(IPAddress, timestamp));
	}

	private void clearFailedLoginAttempts(String IPAddress) {
		for(LoginRecord r : this.failedLoginAttempts)
			if(r.getIP().equals(IPAddress))
				this.failedLoginAttempts.remove(r);
	}

	public boolean hasKnownIP(String IPAddress) {
		for(LoginRecord r : this.knownIPs)
			if(r.getIP().equals(IPAddress))
				return true;
		return false;
	}

	public boolean login(String email, String password, String IP, long timestamp) throws AuthenticationException {

		long timeSinceLastFailedLogin = timestamp - getLastFailedLogin();
		int failedLoginAttempts = getFailedLoginAttempts(IP);


		// If it's been at least 6 hours since the last failed login attempt, clear the failed login attempt log for the provided IP address
		if(timeSinceLastFailedLogin > 21600000) clearFailedLoginAttempts(IP);

		if(timeSinceLastFailedLogin < 1000) {
			addFailedLoginAttempt(IP, timestamp);
			throw new AuthenticationException("Only 1 login attempt per second");
		}
		else if(hasKnownIP(IP) && failedLoginAttempts > 30 || failedLoginAttempts > 10) {
			throw new AuthenticationException("Too many failed login attempts");
		}
		else if(this.email.equals(email) && this.password.equals(password)) {
			addSuccessfulLoginAttempt(IP, timestamp);
			clearFailedLoginAttempts(IP);
			return true;
		}
		else {
			addFailedLoginAttempt(IP, timestamp);
			return false;
		}
	}
}
