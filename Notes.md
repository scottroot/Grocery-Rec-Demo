## Challenges of complementary item recommendations
* Training an NLP model with contrastive loss requires identifying product pairs commonly found together in orders, as well as selecting negative pairings—products unlikely to complement each other. It’s crucial to avoid imposing subjective opinions when selecting these negative pairs, as the model’s performance depends heavily on ensuring these decisions are grounded in objective, data-driven criteria.

* Complementary items can sometimes overlap with similar items. For instance, while "Birthday Cake" intuitively pairs well with candles or ice cream, the Instacart dataset reveals that over 50% of orders containing "Birthday Cake" also include similar items like chocolate cake or cupcakes. This highlights the need to carefully balance complement recommendations, ensuring we don't overemphasize complements when similar items are statistically more common.

## Plans for metrics and evaluation to compare against traditional methods (like apriori)
* Precision/Recall at K: Top-K prediction precision
* Mean Reciprocal Rank (MRR)
* Normalized Discounted Cumulative Gain (nDCG)
* Hit Rate
* TODO: Some other tests to apply to each Aisle or Section
