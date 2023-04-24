const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction')

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/transactions/',
  isLoggedIn,
  async (req, res, next) => {
      const sort = req.query.sortBy;
      let transactions = [];
      if (sort == 'category') {
        transactions = await Transaction.find({})
          .sort({ category: 1 });
      } else if (sort == 'amount') {
        transactions = await Transaction.find({})
          .sort({ amount: 1 });
      } else if (sort == 'description') {
        transactions = await Transaction.find({})
          .sort({ description: 1 });
      } else if (sort== 'date') {
        transactions= await Transaction.find({})
          .sort({ date: 1 });
      } else {
        transactions = await Transaction.find({});
      }
      res.render('transactions', { transactions });
});

    
router.post('/transaction', 
  isLoggedIn,
  async (req, res, next) => {
    const transaction = new Transaction(
      { description, amount, category, date } = req.body);
    await transaction.save();
    res.redirect('/transactions');
});

router.get('/transaction/edit/:id',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/edit/:id")
      const transaction = await Transaction.findOne({ _id: req.params.id });
      res.locals.transaction = transaction;
      res.render('editTransaction');
});

router.get('/transaction/remove/:id',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/remove/:id")
      await Transaction.deleteOne({ _id: req.params.id })
      res.redirect('/transactions');
});


router.post('/transaction/update/:id', 
  isLoggedIn, 
  async (req, res, next) => {
    console.log("inside /transaction/update/:id")
    await Transaction.findOneAndUpdate(
        { _id: req.body.transactionId },
        {$set: {description: req.body.description,
                category: req.body.category,
                amount: req.body.amount,
                date: req.body.date,
                }});
    res.redirect('/transactions');
});

router.get('/transaction/groupByCategory',
  isLoggedIn,
  async (req, res, next) => {
        console.log("inside /transaction/groupByCategory")
        const groupByCategory = await Transaction.aggregate([
            { $group: { _id: '$category', total: { $sum: '$amount' } } }    
        ]);
        res.locals.groupByCategory = groupByCategory;
        res.render('groupByCategory');
    });

module.exports = router;
