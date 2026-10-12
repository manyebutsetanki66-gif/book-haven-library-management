# Book Haven manual testing checklist

Run `npm install` and `npm run dev`, then use the app in a browser.

- [ ] On first launch, create your own administrator account; confirm there are no preset credentials.
- [ ] Log in with the account you created; test a wrong password and confirm access is denied.
- [ ] Visit Dashboard, Books, Transactions, and Users using the navigation.
- [ ] Add a book with all required fields; confirm it appears in the list and dashboard.
- [ ] Try an empty form, malformed ISBN, and duplicate ISBN; confirm validation blocks invalid input.
- [ ] Update a book and confirm changes persist after refreshing.
- [ ] Delete a book and confirm it is removed.
- [ ] Search books by title, author, genre, and ISBN; clear the search.
- [ ] Add stock and confirm stock quantity and transaction history update.
- [ ] Deduct stock and confirm quantity decreases.
- [ ] Try to deduct more copies than are in stock; confirm the app blocks it.
- [ ] Confirm books with fewer than 2 copies are highlighted on the dashboard.
- [ ] Add a user with name, membership ID, username, password, and role; confirm that account can log in after logging out.
- [ ] Try duplicate membership ID and duplicate username; confirm validation blocks both.
- [ ] Update and delete a user.
- [ ] Refresh the browser and confirm saved records remain.
- [ ] Log out and confirm protected pages send you to the login page.
