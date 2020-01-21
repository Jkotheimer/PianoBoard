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

	public Account getAccountByEmail(String email) throws IOException {
		for(Account a : database) if(a.getEmail().equals(email)) return a;
		throw new IOException("Account with email " + email + " does not exist");
	}

	public Account getAccountById(String ID) throws IOException {
		for(Account a : database) if(a.getID().equals(ID)) return a;
		throw new IOException("Account with ID " + ID + " does not exist");
	}

	public List<Account> searchByUsername(String query) {
		System.out.println("Searched for " + query);
		List<Account> accounts = new ArrayList<>();
		for(Account a : database)
			if(a.getUsername().contains(query) || a.getEmail().contains(query)) accounts.add(a);
		return accounts;
	}

	public void create(Account a) throws IOException {
		for(Account acc : database)
			if(acc.getEmail().equals(a.getEmail()))
				throw new IOException("Account with email " + a.getEmail() + " already exists");

		database.add(a);
	}

	public void update(Account acc) throws IOException {
		for(Account a : database) {
			if(a.getID().equals(acc.getID())) {
				database.remove(a);
				database.add(acc);
				return;
			}
		}
		throw new IOException("Account with ID " + acc.getID() + " does not exist");
	}
}
