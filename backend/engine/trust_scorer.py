from typing import Dict, Any

class SourceTrustEvaluator:
    @staticmethod
    def evaluate_source(url: str, domain_type: str = "OFFICIAL", has_https: bool = True, historical_accuracy: float = 0.95) -> Dict[str, Any]:
        score = 0.0
        factors = []

        # 1. Domain Type
        dt_upper = domain_type.upper()
        if dt_upper == "GOVT" or ".gov." in url or ".gov" in url or ".edu.np" in url or ".edu" in url:
            score += 0.45
            factors.append("Authoritative Education/Government Domain (+0.45)")
        elif dt_upper == "OFFICIAL" or "tu.edu.np" in url or "ku.edu.np" in url or "ioe.edu.np" in url:
            score += 0.40
            factors.append("Verified Institutional Primary Portal (+0.40)")
        elif dt_upper == "INSTITUTIONAL":
            score += 0.30
            factors.append("Institutional Sub-Entity (+0.30)")
        elif dt_upper == "BLOG" or "wordpress" in url or "medium" in url:
            score += 0.10
            factors.append("Informal Blog / Third-Party Source (+0.10)")
        else:
            score += 0.15
            factors.append("General Web Source (+0.15)")

        # 2. HTTPS / Protocol Security
        if has_https or url.startswith("https://"):
            score += 0.15
            factors.append("Secure Encrypted Endpoint (+0.15)")

        # 3. Historical Accuracy Score
        hist_weight = min(0.40, max(0.0, historical_accuracy * 0.40))
        score += hist_weight
        factors.append(f"Historical Verification Consistency (+{hist_weight:.2f})")

        # Clamp between 0.0 and 1.0
        final_score = min(1.0, max(0.1, round(score, 2)))

        if final_score >= 0.88:
            trust_tier = "VERY_HIGH"
            actionable = True
        elif final_score >= 0.70:
            trust_tier = "HIGH"
            actionable = True
        elif final_score >= 0.50:
            trust_tier = "MEDIUM"
            actionable = False  # requires cross-verification
        else:
            trust_tier = "LOW"
            actionable = False

        return {
            "reliability_score": final_score,
            "trust_tier": trust_tier,
            "can_auto_update": actionable,
            "factors": factors
        }
