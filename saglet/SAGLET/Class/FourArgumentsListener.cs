using Quobject.EngineIoClientDotNet.ComponentEmitter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SAGLET.Class
{
    public class FourArgumentsListener : IListener
    {
        private static int id_counter = 0;
        private int Id;
        private readonly Action<object, object, object, object> fn;

        public FourArgumentsListener(Action<object, object, object, object> fn)
        {
            this.fn = fn;
            this.Id = id_counter++;
        }

        public void Call(params object[] args)
        {
            var arg1 = args.Length > 0 ? args[0] : null;
            var arg2 = args.Length > 1 ? args[1] : null;
            var arg3 = args.Length > 2 ? args[2] : null;
            var arg4 = args.Length > 3 ? args[3] : null;

            fn(arg1, arg2, arg3, arg4);
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