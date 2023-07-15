class RecentTransactions(object):
    
    def processor(self,airtime,data,cable,electricity):
        self.mergedTransactionHistory = []
        
        for transaction in airtime:
            transaction['network'] = transaction['network'].split(",")[0]
            self.mergedTransactionHistory.append(transaction)
        for transaction in data:
            transaction['network'] = transaction['network'].split(",")[0]
            self.mergedTransactionHistory.append(transaction)
        for transaction in cable:
            transaction['cable_network'] = transaction['cable_network'].split(",")[0]
            self.mergedTransactionHistory.append(transaction)
        for transaction in electricity:
            transaction['disco'] = transaction['disco'].split('(')[1].split(")")[0]
            self.mergedTransactionHistory.append(transaction)
        
        self.sorted_mergedTransactionHistory =  sorted(self.mergedTransactionHistory, key = lambda i: i['timestamp']) #Order is from oldest to most recent
        self.sorted_mergedTransactionHistory.reverse() #Reverse the list to get most recent
        print("\n\nEquality ",self.sorted_mergedTransactionHistory == self.mergedTransactionHistory)
        return self.sorted_mergedTransactionHistory[:10]
    
    