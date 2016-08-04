using Quobject.EngineIoClientDotNet.ComponentEmitter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SAGLET.Class
{
    public class TwoArgumentsListener : IListener
    {
        private static int id_counter = 0;
        private int Id;
        private readonly Action<object, object> fn;

        public TwoArgumentsListener(Action<object, object> fn)
        {
            this.fn = fn;
            this.Id = id_counter++;
        }

        public void Call(params object[] args)
        {
            var arg1 = args.Length > 0 ? args[0] : null;
            var arg2 = args.Length > 1 ? args[1] : null;

            fn(arg1, arg2);
        }


        public int CompareTo(IListener other)
        {
            return this.GetId().CompareTo(other.GetId());
        }

        public int GetId()
        {
            return Id;
        }
    }

    
}