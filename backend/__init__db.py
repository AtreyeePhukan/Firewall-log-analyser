# init_db.py

import asyncio
from database import create_logs_table

async def main():
    await create_logs_table()
    print("✅ Table 'logs_processed' created successfully (if it didn't already exist).")

if __name__ == "__main__":
    asyncio.run(main())
