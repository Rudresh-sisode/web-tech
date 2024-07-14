from vapi_python import Vapi
import time

vapi = Vapi(api_key='3640ab10-0e35-48d9-8cd6-0778cce59641')
vapi.start(assistant_id='114b0d08-dd88-4a4f-82ca-a7b1625debaf')

# Wait for 2 minutes
time.sleep(120)

vapi.stop()