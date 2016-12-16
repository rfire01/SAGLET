using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace SAGLET.Class
{
    public sealed class QueuedLock
    {
        private object innerLock;
        private int ticketsCount = 0;
        private int currentTicket = 1;

        public QueuedLock()
        {
            innerLock = new object();
        }

        public void Enter()
        {
            int myTicket = Interlocked.Increment(ref ticketsCount);
            Monitor.Enter(innerLock);
            while (myTicket != currentTicket)
            {
                Monitor.Wait(innerLock);
            }
        }

        public void Exit()
        {
            Interlocked.Increment(ref currentTicket);
            Monitor.PulseAll(innerLock);
            Monitor.Exit(innerLock);
        }
    }
}