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

import pianoboard.domain.account.*;

public class AccountAccessor {

	private List<Account> database;

	public AccountAccessor() {
		database = new ArrayList<>();
	}

	public Account getAccountByUsername(String username) throws IOException {
		return "An Account retrieved by username: " + username;
	}

	public Account getAccountById(String ID) throws IOException {
		return "An Account retrieved by ID: " + ID;
	}

	public List<Account> search(String query) {
		System.out.println("Searched for " + query);
		List<Account> accounts = new ArrayList<String>();
		for(Account a : database)
			if(a.getUsername().contains(query) || a.getEmail().contains(query)) accounts.add(a);
		return accounts;
	}

	public void create(Account a) throws IOException {
		database.add(a);
	}

	public void update(Account acc) throws IOException {
		for(Account a : database) {
			if(a.getID().equals(acc.getID())) {
				database.remove(a);
				break;
			}
		}
		database.add(acc);
	}
}
