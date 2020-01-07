package pianoboard.domain.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import javax.naming.AuthenticationException;
import java.util.UUID;
import java.util.Calendar;
import java.io.IOException;

import pianoboard.data_access.account.*;

public class AccountManager {

	private Account_Data_Accessor database = new Account_Data_Accessor();
	private TokenAccessor tokenDB = new TokenAccessor();
	private ObjectMapper mapper = new ObjectMapper();

	public AccountManager() {}

	public Account get(String username) throws IOException, JsonProcessingException {
		Account a = mapper.readValue(database.get(username), Account.class);
		return a.get(username);
	}

	public List<String> search(String query) throws IOException {
		return database.search(query);
	}

	public Token authorize(String username, String password, String IP) throws AuthenticationException {
		long timestamp = Calendar.getTimeInMillis();
		Account a = mapper.readValue(database.get(username), Account.class);
		if(a.login(username, password, IP, timestamp)) {
			// Add 2 days onto the current time for the expiration date
			Token t = new Token(username, UUID.randomUUID().toString(), Long.toString(timestamp + 172800000));
			tokenDB.put(t);
			return t;
		}
		else throw new AuthenticationException("Invalid Credentials");
	}

	public Token authorize(String token, String IP) throws AuthenticationException {
		// TODO validate token and add IP to account
	}

	public Account create(String username, String password) throws IOException, JsonProcessingException {
		Account a = new Account(UUID.randomUUID().toString(), username, password, Calendar.getTimeInMillis());
		database.create(username, mapper.writeValueAsString(a));
		return a;
	}
}
