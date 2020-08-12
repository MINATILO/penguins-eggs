/* === This file is part of Calamares - <http://github.com/calamares> ===
 *
 *   Copyright 2015, Teo Mrnjavac <teo@kde.org>
 *   Copyright 2018, Jonathan Carter <jcc@debian.org>
 *
 *   Calamares is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, or (at your option) any later version.
 *
 *   Calamares is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with Calamares. If not, see <http://www.gnu.org/licenses/>.
 */


// https://github.com/calamares/calamares-extensions


import QtQuick 2.0;
import calamares.slideshow 1.0;

Presentation
{
    id: presentation

    Timer {
        interval: 10000
        running: true
        repeat: true
        onTriggered: presentation.goToNextSlide()
    }
    Slide {
        Image {
            id: slide1
            source: "slide1.png"
            anchors.centerIn: parent
            width: 810
            height: 485
            fillMode: Image.PreserveAspectFit
        }
         Text {
            font.family: "Helvetica"
            font.pixelSize : 22
            color: "#002439"
            anchors.horizontalCenter: slide1.horizontalCenter
            anchors.top: slide1.verticalCenter
            text: qsTr("Da professionisti per professionisti")
            wrapMode: Text.WordWrap
            width: 600
            horizontalAlignment: Text.Center
        }
    }
    Slide {
        Image {
            id: slide2
            source: "slide2.png"
            anchors.centerIn: parent
            width: 810
            height: 485
            fillMode: Image.PreserveAspectFit
        }
         Text {
            font.family: "Helvetica"
            font.pixelSize : 22
            color: "#002439"
            anchors.horizontalCenter: slide2.horizontalCenter
            anchors.top: slide2.verticalCenter
            text: qsTr("Scegliete la versione più adatta ai vostri bisogni")
            wrapMode: Text.WordWrap
            width: 600
            horizontalAlignment: Text.Center
        }
    }

    Slide {
        Image {
            id: slide3
            source: "slide3.png"
            anchors.centerIn: parent
            width: 810
            height: 485
            fillMode: Image.PreserveAspectFit
        }
         Text {
            font.family: "Helvetica"
            font.pixelSize : 22
            color: "#002439"
            anchors.horizontalCenter: slide3.horizontalCenter
            anchors.top: slide3.verticalCenter
            text: qsTr("Roma 2.0.1 per pc con processori a 32bit, basato su Devuan 3 Beowulf e con desktop manager Xfce")
            wrapMode: Text.WordWrap
            width: 600
            horizontalAlignment: Text.Center
        }
    }

    Slide {
        Image {
            id: slide4
            source: "slide4.png"
            anchors.centerIn: parent
            width: 810
            height: 485
            fillMode: Image.PreserveAspectFit
        }
         Text {
            font.family: "Helvetica"
            font.pixelSize : 22
            color: "#002439"
            anchors.horizontalCenter: slide4.horizontalCenter
            anchors.top: slide4.verticalCenter
            text: qsTr(" Mantova 2.0.1 per pc con processori a 64bit, basato su PCLinuxOS e con desktop manager Mate")
            wrapMode: Text.WordWrap
            width: 600
            horizontalAlignment: Text.Center
        }
    }

    Slide {
        Image {
            id: slide5
            source: "slide5.png"
            anchors.centerIn: parent
            width: 810
            height: 485
            fillMode: Image.PreserveAspectFit
        }
         Text {
            font.family: "Helvetica"
            font.pixelSize : 22
            color: "#002439"
            anchors.horizontalCenter: slide5.horizontalCenter
            anchors.top: slide5.verticalCenter
            text: qsTr("Vieste 2.0.1 per pc con processori a 64bit, basato su Linux Mint 19.3 e con desktop manager Mate")
            wrapMode: Text.WordWrap
            width: 600
            horizontalAlignment: Text.Center
        }
    }

    Slide {
        Image {
            id: slide6
            source: "slide6.png"
            anchors.centerIn: parent
            width: 810
            height: 485
            fillMode: Image.PreserveAspectFit
        }
         Text {
            font.family: "Helvetica"
            font.pixelSize : 22
            color: "#002439"
            text: qsTr("Gabii 2.0.1 per pc con processori a 64bit, basato su Linux Mint 20 e con desktop manager cinnamon")
            anchors.horizontalCenter: slide6.horizontalCenter
            anchors.top: slide6.verticalCenter
            wrapMode: Text.WordWrap
            width: 600
            horizontalAlignment: Text.Center
        }
    }

    Slide {
        Image {
            id: slide7
            source: "slide7.png"
            anchors.centerIn: parent
            width: 810
            height: 485
            fillMode: Image.PreserveAspectFit
        }
         Text {
            font.family: "Helvetica"
            font.pixelSize : 22
            color: "#002439"
            anchors.horizontalCenter: slide7.horizontalCenter
            anchors.top: slide7.verticalCenter
            text: qsTr("Penguin's eggs")
                  "<br/>"+
                  "<br/>"+
                  "<br/><p>Follow the penguin's eggs development, it's funny and istructive.</p>" +
                  "<p>Penguin's eggs and it's developer need help, " +
                  "use this tool, enjoy and if you can collaborate.</p>"+
                  "<br/>That's all peoples!")
            wrapMode: Text.WordWrap
            width: 600
            horizontalAlignment: Text.Center
        }
    }

}
