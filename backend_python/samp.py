        
        
        
def Cvolt(amp,watt,va,wh,mah,kva):
    if(amp and watt):
        return (float(watt)/float(amp))
    if(va and amp):
        return (float(va)/float(amp))
    if(kva and amp):
        return (float(kva)/(1000*float(amp)))
    if(wh and mah):
        return (float(wh)*1000)/float(mah)
    return ""

def Cwatt(amp,volt,kw,wh,time,joule):
    if(amp and volt):
        return (float(amp)*float(volt))
    if(kw):
        return (float(kw)/1000)
    if(wh and time):
        return (float(wh)/float(time))
    if(joule and time):
        return (float(joule)/(float(time)*3600))
    return ""
def Camp(volt,watt,va,kva):
    if(watt and volt):
        return (float(watt)/float(volt)) 
    if(va and volt):
        return (float(va)/float(volt))
    if(kva and v):
        return (float(kva)/(1000*float(volt)))
    return ""

def Ckw(watt):
    if watt:
        return (float(watt)*1000) 
    return ""
def Cjoule(time,watt):
    if watt and time:
        return (float(watt)*(float(time)*3600))

def Cva(volt,amp):
    if volt and amp:
        return(float(volt)*float(amp))

def Ckva(volt,amp):
    if volt and amp:
        return (1000*(float(volt)*float(amp)))

def Cwh(watt,time,mAh,volt):
    if(watt and time):
        return (float(watt)*float(time))
    if(mah and volt):
        return (float(mAh) * float(volt) / 1000)
def CmAh(wh,volt):
    if wh and volt:
        return (1000 * float(wh) / float(volt)) 

def Ctime(wh,watt,joule):
    if wh and watt:
        return (float(wh)/float(watt))
    if joule and watt:
        return (float(joule)/(float(watt)*3600))
amp = "10"
volt = "1"
watt = ""
time = ""
kva = ""
kw = ""
joule = ""
va = ""
wh = "1"
mah = ""

for i in range(2):
    if not volt:
        volt=Cvolt(amp,watt,va,wh,mah,kva)
    if not watt:
        watt=Cwatt(amp,volt,kw,wh,time,joule)
    if not amp:
        amp=Camp(volt,watt,va,kva)
    if not kw:
        kw=Ckw(watt)
    if not joule:
        joule=Cjoule(time,watt)
    if not kva:
        kva=Ckva(volt,amp)
    if not va:
        va=Cva(volt,amp)
    if not wh:
        wh=Cwh(watt,time,mAh,volt)
    if not mah:
        mah=CmAh(wh,volt)
    if not time:
        time=Ctime(wh,watt,joule)
print(watt,amp,volt,kw,kva,joule,va,wh,mah,time)