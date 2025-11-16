# Import the actual ML model
from .crop_predictor import predict_yield

# Re-export for backward compatibility
__all__ = ['predict_yield']
