package pianoboard.data_access.account;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

public class Accountccessor {

	private List<String[]> database;

	public AccountAccessor() {
		database = new ArrayList<String[]
	}

	public String get(String username) throws IOException {
		return "An Account";
	}

	public List<String> search(String query) {
		// TODO search the database for any username matches to the query
		return Arrays.asList("Username 1", "Username two", "Username tres");
	}

	public void create(String username, String accountJSON) throws IOException {
		// TODO create a new entry in the database with the given info
	}
}
