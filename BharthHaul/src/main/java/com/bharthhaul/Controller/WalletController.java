package com.bharthhaul.Controller;

import com.bharthhaul.Model.Wallet;
import com.bharthhaul.Model.Transaction;
import com.bharthhaul.Repository.WalletRepository;
import com.bharthhaul.Repository.TransactionRepository;
import com.bharthhaul.Repository.UserRepository;
import com.bharthhaul.Model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletRepository walletRepo;
    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;

    public WalletController(WalletRepository walletRepo,
                            TransactionRepository transactionRepo,
                            UserRepository userRepo) {
        this.walletRepo = walletRepo;
        this.transactionRepo = transactionRepo;
        this.userRepo = userRepo;
    }

    
    @GetMapping("/{userId}")
    public ResponseEntity<Double> getBalance(@PathVariable Long userId) {
        Wallet wallet = walletRepo.findByUserId(userId);
        if (wallet == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(wallet.getBalance());
    }

    
    @PostMapping("/add/{userId}")
    public ResponseEntity<String> addMoney(@PathVariable Long userId,
                                           @RequestParam double amount,
                                           @RequestParam String method) {
        Wallet wallet = walletRepo.findByUserId(userId);
        if (wallet == null) {
            Optional<User> userOpt = userRepo.findById(userId);
            if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found");
            wallet = new Wallet();
            wallet.setUser(userOpt.get());
            wallet.setBalance(0.0);
        }
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepo.save(wallet);

        Transaction tx = new Transaction();
        tx.setWallet(wallet);
        tx.setAmount(amount);
        tx.setType("credit");
        tx.setMethod(method);
        transactionRepo.save(tx);

        return ResponseEntity.ok("Money added successfully");
    }

    
    @PostMapping("/withdraw/{userId}")
    public ResponseEntity<String> withdrawMoney(@PathVariable Long userId,
                                                @RequestParam double amount,
                                                @RequestParam String method) {
        Wallet wallet = walletRepo.findByUserId(userId);
        if (wallet == null || wallet.getBalance() < amount) {
            return ResponseEntity.badRequest().body("Insufficient balance or wallet not found");
        }
        wallet.setBalance(wallet.getBalance() - amount);
        walletRepo.save(wallet);

        Transaction tx = new Transaction();
        tx.setWallet(wallet);
        tx.setAmount(amount);
        tx.setType("debit");
        tx.setMethod(method);
        transactionRepo.save(tx);

        return ResponseEntity.ok("Withdrawal successful");
    }

    
    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long userId) {
        Wallet wallet = walletRepo.findByUserId(userId);
        if (wallet == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Transaction> transactions = transactionRepo.findByWalletId(wallet.getId());
        return ResponseEntity.ok(transactions);
    }
}
