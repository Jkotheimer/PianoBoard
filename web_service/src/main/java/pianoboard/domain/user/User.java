package pianoboard.domain.user;

public class User {
	
	private String email;
	private String username;
	private String password;
	private String ID;
	
	public User(String email, String username, String Password) {
		this.email = email;
		this.username = username;
		this.password = password;
		// TODO: Generate a unique ID
	}
	
	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	
	public String getUsername() {
		return this.username;
	}
	
	public String getID() {
		return this.ID;
	}
	
	public boolean authenticate(String username, String password) {
		return (this.username == username && this.password == password);
	}
	
	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
}
