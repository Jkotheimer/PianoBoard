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

import pianoboard.domain.account.Account;

public class AccountAccessor {

	private static List<Account> database = new ArrayList<>();

	public AccountAccessor() {}

	/**
	 * CREATE
	 * ________________________________________________________________________
	 */
	public void create(Account a) throws IOException {
		for(Account acc : database)
			if(acc.getEmail().equals(a.getEmail()))
				throw new IOException("Account with email " + a.getEmail() + " already exists");

			database.add(a);
	}

	/**
	 * READ
	 * ________________________________________________________________________
	 */
	public Account getAccountByEmail(String email) throws IOException {
		for(Account a : database)
			if(a.getEmail().equals(email))
				return a;
		throw new IOException("Account with email " + email + " does not exist");
	}

	public Account getAccountById(String ID) throws IOException {
		for(Account a : database)
			if(a.getID().equals(ID))
				return a;
		throw new IOException("Account with ID " + ID + " does not exist");
	}

	public List<Account> search(String query) {
		List<Account> accounts = new ArrayList<>();
		for(Account a : database)
			if(a.getUsername().contains(query) || a.getEmail().contains(query))
				accounts.add(a);
		return accounts;
	}

	/**
	 * UPDATE
	 * ________________________________________________________________________
	 */
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

	/**
	 * DELETE
	 * ________________________________________________________________________
	 */
	public void delete(String ID) throws IOException {
		for(Account a : database) {
			if(a.getID().equals(ID)) {
				database.remove(a);
				return;
			}
		}
		throw new IOException("Account with ID " + ID + " does not exist");
	}
}
