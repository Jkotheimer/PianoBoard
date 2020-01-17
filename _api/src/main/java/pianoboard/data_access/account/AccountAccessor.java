package pianoboard.data_access.account;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

public class AccountAccessor {

	private Map<String, String> database;

	public AccountAccessor() {
		database = new HashMap<String, String>();
	}

	public String get(String username) throws IOException {
		return "An Account";
	}

	public List<String> search(String query) {
		// TODO search the database for any username matches to the query
		System.out.println("Searched for " + query);
		List<String> thing = new ArrayList<String>();
		thing.add("ass");
		thing.add("booty");
		thing.add(query);
		thing.add("fuckhole");
		return thing;
	}

	public void create(String username, String accountJSON) throws IOException {
		// TODO create a new entry in the database with the given info
	}
}
