# 17. Monitoring and Observability

## Monitoring Stack

Our monitoring strategy is based on leveraging the native capabilities of our chosen platforms.

- **Frontend Monitoring**: We will use **Vercel Analytics**. It is enabled by default and provides real-time data on Core Web Vitals, traffic sources, and overall site performance with zero configuration.
    
- **Backend Monitoring**:
    
    - **Supabase**: We will use the built-in logs viewer in the Supabase dashboard to monitor our Edge Function invocations, execution times, and errors.
        
    - **AWS**: We will use **Amazon CloudWatch** for our Lambda function. It automatically captures logs, invocation counts, error rates, and execution duration. We will set up a basic CloudWatch Alarm for a high error rate.
        
- **Error Tracking**: For proactive client-side error tracking, I recommend integrating **Sentry** on its free tier. It will capture and report any JavaScript errors that occur in a user's browser, giving us visibility into issues we might otherwise miss.
    
- **Performance Monitoring**: Vercel Analytics and AWS CloudWatch will provide our primary performance metrics for the frontend and backend, respectively.
    

## Key Metrics

For the MVP, we will focus on monitoring a few key health indicators:

- **Frontend Metrics**:
    
    - Core Web Vitals (LCP, FID, CLS)
        
    - Client-side JavaScript Error Rate
        
    - API Response Times (as measured from the client)
        
- **Backend Metrics**:
    
    - Function Invocation Count (Supabase & AWS)
        
    - Function Error Rate (Supabase & AWS)
        
    - Function Duration, especially for the AWS Lambda to ensure it stays well below the 15-minute timeout.